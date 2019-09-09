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
    console.log(event.payload.response_url);

    let spaceKey = event.payload.message.text
    let content = event.payload.message.attachments[1].text
    content = content.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&')
    let recipients = event.payload.message.blocks[0].text.text.split(',')
    recipients = recipients.map(r => r.split("mailto:")[1].split("|")[0]).join(",")

    const body = {
        "replace_original": "true",
        "text": "Email report sent successfully!"
    }

    console.log(recipients)
    
    nodeoutlook.sendEmail({
        auth: {user: "s993076@syngenta.org", pass: process.env.O365_PW},
        // sender: "Brandon.Dohman@syngenta.com",
        replyTo: "Brandon.Dohman@syngenta.com",
        to: recipients,
        subject: `NA DPE Weekly Status Report - ${spaceKey}`,
        html: content,
        attachments: [],
        onError: (e) => console.log(e),
        onSuccess: async (i) => await axios.post(event.payload.response_url, body)
    });
};