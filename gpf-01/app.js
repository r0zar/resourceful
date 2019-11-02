const axios = require('axios');

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
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = "<YOUR_VERIFY_TOKEN>"

    console.log(JSON.stringify(event))
    // // Parse the query params
    // let mode = req.query['hub.mode'];
    // let token = req.query['hub.verify_token'];
    // let challenge = req.query['hub.challenge'];

    // // Checks if a token and mode is in the query string of the request
    // if (mode && token) {

    //     // Checks the mode and token sent is correct
    //     if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            
    //         // Responds with the challenge token from the request
    //         console.log('WEBHOOK_VERIFIED');
    //         res.status(200).send(challenge);

    //     } else {
    //         // Responds with '403 Forbidden' if verify tokens do not match
    //         res.sendStatus(403);      
    //     }
    // }
    return await Promise.resolve(200)
};