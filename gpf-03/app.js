const axios = require('axios');
const HTMLParser = require('node-html-parser');

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
    
    let spaceKey = event.actions[0].action_id;

    let dataPromise = axios.get(`/rest/api/space/${spaceKey}/content?expand=body.view`, options)
        .then((response) => {
            let allPages = response.data.page.results.map(page => page.body.view.value).join('');
            let html = HTMLParser.parse(allPages, {
                singleNewLineParagraphs: true,
                tables: true
            });

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
        
    let data, body;

    [data] = await Promise.all([dataPromise]);
    
    if (!errorDetected) {
    
        data = `<div>Hello all,</div>
<br />
<p>Information shown below is achievements of last week, with next steps being for week starting on September 3rd. If you would like to see all work happening in our team, please check out our <a href="https://digitial-product-engineering.atlassian.net/wiki/spaces/${event.text}/overview">dashboard here</a>.</p><br />` + data + `<br /><p>If you feel that I missed someone on this email or have questions, please reach out to me.</p>
<br />
<div>\*\* We've implemented an automated reporting service. If you received this in error or found a bug, please let me know.</div>
<br />
<div>Cheers,</div>
<div>Brandon</div>`;
    
        body = {
            "response_type": "ephemeral",
            "replace_original": false,
            "text": "Confluence-generated HTML status report",
            attachments: [
            	{
            		"color": "#d9d9d9",
            		"text": data
            	}
        	]
        };
        
        return await axios.post(event.response_url, body).then(response => response.status);
        
    } else {
        return event;
    }
      
};