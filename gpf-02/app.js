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
    
    let blocks = [
  		{
  			"type": "section",
  			"text": {
  				"type": "mrkdwn",
  				"text": "Should we test if users would like the option of a 'dark mode' in farmshots?"
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
  						"text": "Downvote"
  					},
  					"style": "danger",
  					"value": "click_me_123"
  				},
  				{
  					"type": "button",
  					"text": {
  						"type": "plain_text",
  						"emoji": true,
  						"text": "Skip"
  					},
  					"value": "click_me_123"
  				},
  				{
  					"type": "button",
  					"text": {
  						"type": "plain_text",
  						"emoji": true,
  						"text": "Cancel"
  					},
  					"value": "click_me_123"
  				},
  				{
  					"type": "button",
  					"text": {
  						"type": "plain_text",
  						"emoji": true,
  						"text": "Upvote"
  					},
  					"style": "primary",
  					"value": "click_me_123"
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
