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
exports.lambdaHandler = async (event) => {

    const blocks = [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": ":microscope: Build a new self-improvement <https://theready.com/cards|experiment>!"
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
                    "text": "Choose a tension..."
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Edit it"
                        },
                        "value": "tension-01"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Read it"
                        },
                        "value": "tension-02"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Save it"
                        },
                        "value": "tension-03"
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
                "type": "multi_static_select",
                "placeholder": {
                    "type": "plain_text",
                    "emoji": true,
                    "text": "Select a practice..."
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Craft a clear and compelling purpose for the organization"
                        },
                        "value": "practice-01"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Craft a clear and compelling purpose for every team and every role"
                        },
                        "value": "practice-02"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Ask teams to share their essential intent for the next 6 to 24 months"
                        },
                        "value": "practice-03"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Clarify the metrics that matter and use them to steer"
                        },
                        "value": "practice-04"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Clarify the metrics that matter and use them to steer"
                        },
                        "value": "practice-05"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Recognize and celebrate noble failure"
                        },
                        "value": "practice-06"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Replace \"Is it perfect?\" with \"Is it safe to try?\""
                        },
                        "value": "practice-07"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Give everyone the freedom to choose where, when and how they work"
                        },
                        "value": "practice-08"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Clarify the decision rights held by teams and roles"
                        },
                        "value": "practice-09"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "Use a waterline to create guardrails around team and individual autonomy"
                        },
                        "value": "practice-10"
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
                    "text": "How long will it last?"
                },
                "options": [
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "1 Week"
                        },
                        "value": "week-1"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "2 Weeks"
                        },
                        "value": "week-2"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "3 Weeks"
                        },
                        "value": "week-3"
                    },
                    {
                        "text": {
                            "type": "plain_text",
                            "emoji": true,
                            "text": "4 Weeks"
                        },
                        "value": "week-4"
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
                    "value": "launch"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "emoji": true,
                        "text": "Cancel"
                    },
                    "value": "cancel"
                }
            ]
        }
    ]

    const responseBody = {
        replace_original: true,
        text: "Create a new experiment!",
        type: "modal",
        title: {
            "type": "plain_text",
            "text": "My App",
            "emoji": true
        },
        submit: {
            "type": "plain_text",
            "text": "Submit",
            "emoji": true
        },
        close: {
            "type": "plain_text",
            "text": "Cancel",
            "emoji": true
        },
        blocks: blocks
    };
    
    let response = await axios.post(event.response_url, responseBody);
    return response.status;
};
