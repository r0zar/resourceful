const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

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
    console.log(JSON.stringify(event))
    let payload = {}

    var params = {
      stateMachineArn: 'arn:aws:states:us-east-1:144504656881:stateMachine:file-upload',
      input: JSON.stringify(payload)
    };

    return await new Promise((resolve, reject) => {
      stepfunctions.startExecution(params, (err, data) => {
        if (err) reject(err, err.stack);  // an error occurred
        else     resolve(data);           // successful response
      });
    });
};
