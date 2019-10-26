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
		view: {
			"type": "modal",
			"title": {
				"type": "plain_text",
				"text": "My App",
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
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*<fakeLink.toYourApp.com|Learning Metrics>*\nHow would you like to measure success?"
            },
            "accessory": {
                "type": "static_select",
                "placeholder": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Pick a metric of success..."
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "% Completed"
                        },
                        "value": "value-0"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "KPI (success metric)"
                        },
                        "value": "value-1"
                    }
                ]
            }
        },
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "title",
						"placeholder": {
							"type": "plain_text",
							"text": "What do you want to ask of the world?"
						}
					},
					"label": {
						"type": "plain_text",
						"text": "Title"
					}
				},
				{
					"type": "input",
					"element": {
						"type": "multi_channels_select",
						"action_id": "channels",
						"placeholder": {
							"type": "plain_text",
							"text": "Where should the poll be sent?"
						}
					},
					"label": {
						"type": "plain_text",
						"text": "Channel(s)"
					}
				},
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "option_1",
						"placeholder": {
							"type": "plain_text",
							"text": "First option"
						}
					},
					"label": {
						"type": "plain_text",
						"text": "Option 1"
					}
				},
				{
					"type": "input",
					"element": {
						"type": "plain_text_input",
						"action_id": "option_2",
						"placeholder": {
							"type": "plain_text",
							"text": "How many options do they need, really?"
						}
					},
					"label": {
						"type": "plain_text",
						"text": "Option 2"
					}
				},
				{
					"type": "actions",
					"elements": [
						{
							"type": "button",
							"action_id": "add_option",
							"text": {
								"type": "plain_text",
								"text": "Add another option  "
							}
						}
					]
				}
			]
		}
	};

	let response = await axios.post('https://slack.com/api/views.open', body, {headers: {"Authorization" : `Bearer ${process.env.SLACK_API_KEY}`}});
	return response.status;
	
};
