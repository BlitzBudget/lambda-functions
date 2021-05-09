const goalParameter = require('../create-parameter/goal');

module.exports.addNewGoals = async (event, documentClient) => {
  const today = new Date();
  const randomValue = `Goal#${today.toISOString()}`;

  const params = goalParameter.createParameter(randomValue, event);

  console.log('Adding a new item...');

  const response = await documentClient.put(params).promise();

  return {
    Goal: response,
  };
};
