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
      stateMachineArn: 'arn:aws:states:us-east-2:990217436416:stateMachine:experiments-vote',
      input: JSON.stringify(payload)
    };
    await new Promise((resolve, reject) => {
      stepfunctions.startExecution(params, (err, data) => {
        if (err) reject(err, err.stack); // an error occurred
        else     resolve(data);           // successful response
      });
    });
    return {
      statusCode: 200
    };
};
