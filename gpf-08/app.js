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

  const config = {
      username: "Ross.Ragsdale@syngenta.com",
      password: process.env.CONFLUENCE_TOKEN,
      baseUrl:  "https://digitial-product-engineering.atlassian.net/wiki"
  };
  
  const options = {
      baseURL: config.baseUrl,
      auth: {username: config.username, password: config.password},
      headers: {'Accept': 'application/json'}
  };
  
  let index = 0;
  if (event.actions && event.actions[0].value == 'next') {
    index = parseInt(event.actions[0].action_id.split('_')[1]) + 10;
  }
  if (event.actions && event.actions[0].value == 'previous') {
    index = parseInt(event.actions[0].action_id.split('_')[1]) - 10;
  }
  
  // confluence docs
  // https://developer.atlassian.com/cloud/confluence/rest/?_ga=2.147616242.455311348.1569531521-2116423718.1569531521#api-space-get
  let spaces = await axios.get(`/rest/api/space?limit=10&start=${index}`, options);
  
  let spaceList = spaces['data']['results'].map(space => {
      return {key: space.key, name: space.name};
  });
  let blocks = spaceList.map(space => {
      return {type: "section", "text": {"type": "mrkdwn", "text": `*${space.key}* :corn: \_${space.name}\_`}};
  });
  
	let divider = {
		"type": "divider"
	};
	
	blocks.unshift(divider);
  
  let text = 'Select a project to get started: `/report <SPACE_KEY>`';
  blocks.unshift({type: "section", "text": {"type": "mrkdwn", "text": `${text}`}});
  
  let previousButton = {
		"type": "button",
		"text": {
			"type": "plain_text",
			"emoji": true,
			"text": `Previous 10 Results`
		},
		"value": `previous`,
		"action_id": `index_${index}_previous`
	}
	
	let nextButton = {
		"type": "button",
		"text": {
			"type": "plain_text",
			"emoji": true,
			"text": `Next 10 Results`
		},
		"value": `next`,
		"action_id": `index_${index}_next`
	}
  
  let paginationButtons = {
		"type": "actions",
		"elements": []
	};
	
	if (index != 0) {
	  paginationButtons.elements.push(previousButton);
	}
	
	if (spaceList.length == 10) {
	  paginationButtons.elements.push(nextButton);
	}
	
	blocks.push(divider);
	blocks.push(paginationButtons);
  
  let body = {
    "response_type": "ephemeral",
    "replace_original": true,
    "text": text,
    "blocks": blocks
  };
    
  return await axios.post(event.response_url, body).then(response => response.status);
};