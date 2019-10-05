const axios = require('axios');
const nodeoutlook = require('nodejs-nodemailer-outlook');

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
exports.lambdaHandler = (event, context) => {

    let spaceName = event.message.text
    let content = event.message.attachments[1].text
    content = content.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')
    let recipients = event.message.blocks[0].text.text.split(',')
    recipients = recipients.map(r => r.split("mailto:")[1].split("|")[0]).join(",")

    const body = {
        "replace_original": "true",
        "text": "Email report sent successfully!"
    }
    
    nodeoutlook.sendEmail({
        auth: {user: "h995818@syngenta.org", pass: process.env.O365_PW},
        replyTo: "Brandon.Dohman@syngenta.com",
        to: recipients,
        subject: `NA DPE Weekly Status Report - ${spaceName}`,
        html: content,
        attachments: [],
        onError: (e) => console.log(e),
        onSuccess: async (i) => await axios.post(event.response_url, body)
    });
};