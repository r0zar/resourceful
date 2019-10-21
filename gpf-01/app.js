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
    
    console.log(JSON.stringify(event));
    
    let blocks = [
		{
			"type": "section",
			"text": {
				"type": "mrkdwn",
				"text": "A new user experiment was created:"
			}
		},
		{
			"type": "section",
			"fields": [
				{
					"type": "mrkdwn",
					"text": "*Type:*\nExperiment"
				},
				{
					"type": "mrkdwn",
					"text": `*When:*\n${new Date()}`
				},
				{
					"type": "mrkdwn",
					"text": `*Created By:*\n${event.user_name}`
				},
				{
					"type": "mrkdwn",
					"text": `*Experiment by testing:*\n${event.text}`
				}
			]
		}
	]
    
    let body = {
        "response_type": "in_channel",
        "text": 'User test created!',
        "blocks": blocks
      };
    
    return await axios.post(event.response_url, body).then(response => response.status);
};