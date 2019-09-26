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

    let dataPromise = axios.get(`/rest/api/space/${event.text}/content?expand=body.view`, options)
        .then((response) => {
            let allPages = response.data.page.results.map(page => page.body.view.value).join('')
            let html = HTMLParser.parse(allPages, {
                singleNewLineParagraphs: true,
                tables: true
            })

            recipients = html.querySelectorAll("table")
                .filter(h => h.outerHTML.includes("Reporting"))
            recipients = recipients[recipients.length - 1]
                .lastChild.lastChild.lastChild.text.split(',')
                .map(r => ` <mailto:${r}|${r.split('@')[0]}>`)

            html.querySelectorAll('span')
                .filter(h => h.outerHTML.includes("ON TRACK"))
                .forEach(h => h.rawAttrs += ' style="color: green;"')

            html.querySelectorAll('span')
                .filter(h => h.outerHTML.includes("DEPLOYED"))
                .forEach(h => h.rawAttrs += ' style="color: purple;"')

            html.querySelectorAll('tbody')
                .forEach(h => h.rawAttrs += ' style="vertical-align: top;"')

            html.querySelectorAll('th')
                .forEach(h => h.rawAttrs += ' style="background: whitesmoke;"')

            html.querySelectorAll('td')
                .forEach(h => h.rawAttrs += ' style="padding-left: 24px;"')

            return html.querySelectorAll("table")
                .filter(h => h.outerHTML.includes("Overall Status") || h.outerHTML.includes("Achievements"))
                .map(h => h.outerHTML)
                .join('')

        })
        .catch(error => error)
        
    let space, data, spaces, spaceList, body
    try {
        [space, data] = await Promise.all([spacePromise, dataPromise]);
        
        let text = htmlToText.fromString(data, {singleNewLineParagraphs: true})
    
        data = `<div>Hello all,</div>
<br />
<p>Information shown below is achievements of last week, with next steps being for week starting on September 3rd. If you would like to see all work happening in our team, please check out our <a href="https://digitial-product-engineering.atlassian.net/wiki/spaces/${event.text}/overview">dashboard here</a>.</p><br />` + data + `<br /><p>If you feel that I missed someone on this email or have questions, please reach out to me.</p>
<br />
<div>Cheers,</div>
<div>Brandon</div>`;
    
        body = {
            "response_type": "in_channel",
            "text": space['data']['name'],
            attachments: [
            	{
            		"color": "#2eb886",
            		"title": text.split("Achievements")[0].replace("\n", ": "),
                    "fields": [
                        {
                            "title": "Details",
                            "value": "Achievements\n" + text.split("Achievements")[1],
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
            		},
            		"accessory": {
            			"type": "button",
            			"text": {
            				"type": "plain_text",
            				"text": "Confirm",
            				"emoji": true
            			},
            			"value": "confirm"
            		}
            	}
            ]
        }

        if (recipients.length === 0) {
            let text = `Oops, looks like that project doesnt have any recipients assigned.`;
            body = {
            "response_type": "ephemeral",
            "replace_original": false,
            "text": text
            }
        }
        
    } catch(err) {
        spaces = await axios.get(`/rest/api/space`, options)
        spaceList = spaces['data']['results'].map(space => {
            return {key: space.key, name: space.name}
        })
        let text = `Hmmm, I couldnt find the *${event.text}* space key in confluence. Try one of the following:`;
        let blocks = spaceList.map(space => {
            return {type: "section", "text": {"type": "mrkdwn", "text": `*${space.key}* :corn: \_${space.name}\_`}}
        })
        blocks.unshift({type: "section", "text": {"type": "mrkdwn", "text": `:thinking_face:... ${text}`}})
        body = {
          "response_type": "ephemeral",
          "replace_original": false,
          "text": text,
          "blocks": blocks
        }
        
    }
    
    
    return await axios.post(event.response_url, body)
      .then(response => response.status)
      
};