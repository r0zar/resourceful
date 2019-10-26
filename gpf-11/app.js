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


	const responseBody = {
		"trigger_id": event.trigger_id,
		"view": {
			"type": "modal",
			"callback_id": "modal-identifier",
			"title": {
				"type": "plain_text",
				"text": "Just a modal"
			},
			"blocks": [
				{
					"type": "section",
					"block_id": "section-identifier",
					"text": {
						"type": "mrkdwn",
						"text": "*Welcome* to ~my~ Block Kit _modal_!"
					},
					"accessory": {
						"type": "button",
						"text": {
							"type": "plain_text",
							"text": "Just a button",
						},
						"action_id": "button-identifier",
					}
				}
			],
		}
	};
	
	let response = await axios.post(event.response_url, responseBody);
	return response.status;
	
};
