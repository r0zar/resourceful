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

  let spaces = await axios.get(`/rest/api/space?limit=49`, options)
  let spaceList = spaces['data']['results'].map(space => {
      return {key: space.key, name: space.name}
  })
  let blocks = spaceList.map(space => {
      return {type: "section", "text": {"type": "mrkdwn", "text": `*${space.key}* :corn: \_${space.name}\_`}}
  })
  body = {
    "response_type": "ephemeral",
    "replace_original": false,
    "text": text,
    "blocks": blocks
  }
    
  if (!errorDetected) {
      return await axios.post(event.response_url, body).then(response => response.status)
  } else {
      throw errorDetected
  }
};