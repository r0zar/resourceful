const axios = require('axios');
const HTMLParser = require('node-html-parser');
const htmlToText = require('html-to-text');

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context) => {
    
    let errorDetected;

    const config = {
        username: "Ross.Ragsdale@syngenta.com",
        password: process.env.CONFLUENCE_TOKEN,
        baseUrl:  "https://digitial-product-engineering.atlassian.net/wiki"
    };

    const options = {
        baseURL: config.baseUrl,
        auth: {username: config.username, password: config.password},
        headers: {'Accept': 'application/json'}
    };
    
    let recipients;
    
    let spacePromise = axios.get(`/rest/api/space/${event.text}`, options)
        .catch(error => {
            errorDetected = error;
        });

    let dataPromise = axios.get(`/rest/api/space/${event.text}/content?expand=body.view`, options)
        .then((response) => {
            let allPages = response.data.page.results.map(page => page.body.view.value).join('');
            let html = HTMLParser.parse(allPages, {
                singleNewLineParagraphs: true,
                tables: true
            });

            recipients = html.querySelectorAll("table")
                .filter(h => h.outerHTML.includes("Reporting"));
                
            recipients = recipients[recipients.length - 1]
                .lastChild.lastChild.lastChild.text.split(';');
            
            recipients = recipients
                .map(r => ` <mailto:${r.split('<')[1].split('>')[0]}|${r.split(' <')[0]}>`);

            html.querySelectorAll('span')
                .filter(h => h.outerHTML.includes("ON TRACK"))
                .forEach(h => h.rawAttrs += ' style="color: green;"');

            html.querySelectorAll('span')
                .filter(h => h.outerHTML.includes("DEPLOYED"))
                .forEach(h => h.rawAttrs += ' style="color: purple;"');

            html.querySelectorAll('tbody')
                .forEach(h => h.rawAttrs += ' style="vertical-align: top;"');

            html.querySelectorAll('th')
                .forEach(h => h.rawAttrs += ' style="background: whitesmoke; padding: 0.4rem 0;"');

            html.querySelectorAll('td')
                .forEach(h => h.rawAttrs += ' style="padding-left: 24px;"');

            return html.querySelectorAll("table")
                .filter(h => h.outerHTML.includes("Overall Status") || h.outerHTML.includes("Achievements"))
                .map(h => h.outerHTML)
                .join('');

        })
        .catch(error => {
            errorDetected = error;
        });
        
    let space, data, body, text;

    [space, data] = await Promise.all([spacePromise, dataPromise]);
    
    if (!errorDetected) {
    
        text = htmlToText.fromString(data, {singleNewLineParagraphs: true});
    
        data = `<div>Hello all,</div>
<br />
<p>Information shown below is achievements of last week, with next steps being for week starting on September 3rd. If you would like to see all work happening in our team, please check out our <a href="https://digitial-product-engineering.atlassian.net/wiki/spaces/${event.text}/overview">dashboard here</a>.</p><br />` + data + `<br /><p>If you feel that I missed someone on this email or have questions, please reach out to me.</p>
<br />
<div>\*\* We've implemented an automated reporting service. If you received this in error or found a bug, please let me know.</div>
<br />
<div>Cheers,</div>
<div>Brandon</div>`;
    
        let title = text.split("Achievements")[0].replace("\n", ": ");
        
        let achievements = text.split("Achievements")[1];
    
        body = {
            "response_type": "in_channel",
            "text": space['data']['name'],
            attachments: [
            	{
            		"color": "#2eb886",
            		"title": title,
                    "fields": [
                        {
                            "title": "Details",
                            "value": "Achievements\n" + achievements,
                            "short": false
                        }
                    ],
            		"ts": Date.now() / 1000
            	},
            	{
            		"color": "#d9d9d9",
            		"text": data
            	}
        	],
            "blocks": [
            	{
            		"type": "section",
            		"text": {
            			"type": "mrkdwn",
            			"text": `Do you want to email this \_${space['data']['name']}\_ report to: ${recipients}?`
            		}
            	},
        		{
        			"type": "actions",
        			"elements": [
        				{
        					"type": "button",
        					"text": {
        						"type": "plain_text",
        						"emoji": true,
        						"text": "Confirm"
        					},
        					"style": "primary",
        					"value": "confirm",
        					"confirm": {
                              "title": {
                                  "type": "plain_text",
                                  "text": "Ready to send?"
                              },
                              "text": {
                                  "type": "mrkdwn",
                                  "text": `\_${space['data']['name']}\_ report is ready to be sent!`
                              },
                              "confirm": {
                                  "type": "plain_text",
                                  "text": "Ship it!"
                              },
                              "deny": {
                                  "type": "plain_text",
                                  "text": "Cancel"
                              }
                            }
        				},
        				// {
        				// 	"type": "button",
        				// 	"text": {
        				// 		"type": "plain_text",
        				// 		"emoji": true,
        				// 		"text": "View HTML"
        				// 	},
        				// 	"value": "viewHtml",
                        //  "action_id": event.text
        				// },
        				{
        					"type": "button",
        					"text": {
        						"type": "plain_text",
        						"emoji": true,
        						"text": "Cancel"
        					},
        					"value": "cancel"
        				}
        			]
        		}
            ]
        };
    
        if (recipients.length === 0) {
            text = `Oops, looks like that project doesnt have any recipients assigned.`;
            body = {
              "response_type": "ephemeral",
              "replace_original": false,
              "text": text
            };
        }
        
        return await axios.post(event.response_url, body).then(response => response.status);
        
    } else {
        return event;
    }
      
};