const walletParameter = require('../create-parameter/wallet');
const helper = require('../utils/helper');

module.exports.addNewWallet = async (userAttributes, currency, documentClient) => {
  const userId = helper.fetchUserId(userAttributes);
  const today = new Date();
  const randomValue = `Wallet#${today.toISOString()}`;

  const params = walletParameter.createParameter(userId, randomValue, currency);

  console.log('Adding a new item...');
  const response = await documentClient.put(params).promise();
  return response;
};
