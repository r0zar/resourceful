const aws = require('aws-sdk');

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
exports.lambdaHandler = async (event) => {
    var stepfunctions = new aws.StepFunctions();
    let body = event['body'];
    let payload = {};
    body.split('&').forEach(param => {
      let p = param.split('=');
      payload[p[0]] = decodeURIComponent(p[1]).split('+').join(' ');
    });
    delete payload.token;
    console.log(JSON.stringify(payload));
    var params = {
      stateMachineArn: 'arn:aws:states:us-east-2:990217436416:stateMachine:experiments-experiment',
      input: JSON.stringify(payload)
    };
    await new Promise((resolve, reject) => {
      stepfunctions.startExecution(params, (err, data) => {
        if (err) reject(err, err.stack); // an error occurred
        else     resolve(data);           // successful response
      });
    });
    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ":microscope: Build a new self-improvement experiment!"
            }
        },
        {
            "type": "divider"
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*<fakeLink.toYourApp.com|Tension>*\nWhat's something that could be improved?"
            },
            "accessory": {
                "type": "static_select",
                "placeholder": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Manage"
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Edit it"
                        },
                        "value": "value-0"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Read it"
                        },
                        "value": "value-1"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Save it"
                        },
                        "value": "value-2"
                    }
                ]
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*<fakeLink.toYourApp.com|Practice>*\nWhat do you propose we try?"
            },
            "accessory": {
                "type": "static_select",
                "placeholder": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Manage"
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Manage it"
                        },
                        "value": "value-0"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Read it"
                        },
                        "value": "value-1"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Save it"
                        },
                        "value": "value-2"
                    }
                ]
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*<fakeLink.toYourApp.com|Participants>*\nWho will be involved?"
            },
            "accessory": {
                "action_id": "text1234",
                "type": "multi_channels_select",
                "placeholder": {
                    "type": "plain_text",
                    "text": "Select channels"
                }
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*<fakeLink.toYourApp.com|Duration>*\nWhen will you conduct a retrospective to collect perspectives and learning?"
            },
            "accessory": {
                "type": "static_select",
                "placeholder": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Manage"
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "1 Week"
                        },
                        "value": "value-0"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "2 Weeks"
                        },
                        "value": "value-1"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "3 Weeks"
                        },
                        "value": "value-2"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "4 Weeks"
                        },
                        "value": "value-3"
                    }
                ]
            }
        },
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
                    "text": "Manage"
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
            "type": "divider"
        },
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": "Launch"
                    },
                    "style": "primary",
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
                }
            ]
        }
    ]
    const responseBody = {
      replace_original: true,
      text: "Done ranking experiments.",
      blocks: blocks
    };
    
    let response = await axios.post(event.response_url, responseBody);
    return response.status;
};
