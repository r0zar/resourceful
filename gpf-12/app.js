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

	const body = {
		trigger_id: event.trigger_id,
		view_id: event.view.id,
		view: {
			"type": "modal",
			"callback_id": "modal-2",
			"title": {
				"type": "plain_text",
				"text": "New Experiment",
				"emoji": true
			},
			"submit": {
				"type": "plain_text",
				"text": "Submit",
				"emoji": true
			},
			"close": {
				"type": "plain_text",
				"text": "Cancel",
				"emoji": true
			},
			"blocks": [
				{
					"type": "input",
					"element": {
						"type": "static_select",
						"action_id": "title",
		                "placeholder": {
		                    "type": "plain_text",
		                    "emoji": true,
		                    "text": "How would you like to measure success?"
		                },
		                "options": [
		                    {
		                        "text": {
		                            "type": "plain_text",
		                            "emoji": true,
		                            "text": "% Completed"
		                        },
		                        "value": "metric-0"
		                    },
		                    {
		                        "text": {
		                            "type": "plain_text",
		                            "emoji": true,
		                            "text": "KPI (success metric)"
		                        },
		                        "value": "metric-1"
		                    }
		                ]
					},
					"label": {
						"type": "plain_text",
						"text": "Improvement criteria"
					}
				},
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "goal-1",
						"placeholder": {
							"type": "plain_text",
							"text": "What KPI metric will be tracked for this experiment?"
						}
					},
					"label": {
						"type": "plain_text",
						"text": "KPI metric under test"
					}
				},
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "goal-1",
						"placeholder": {
							"type": "plain_text",
							"text": "What is a reasonable goal to target for that metric?"
						}
					},
					"label": {
						"type": "plain_text",
						"text": "Target by end of experiment"
					}
				}
			]
		}
	};

	let response = await axios.post('https://slack.com/api/views.update', body, {headers: {"Authorization" : `Bearer ${process.env.SLACK_API_KEY}`}});
	return response.status;
	
};
