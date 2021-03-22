const wallet = () => {};

const walletParameter = require('../create-parameter/wallet');
const helper = require('../utils/helper');

wallet.prototype.addNewWallet = async (userAttributes, currency, DB) => {
  const userId = helper.fetchUserId(userAttributes);
  const today = new Date();
  const randomValue = `Wallet#${today.toISOString()}`;

  const params = walletParameter.createParameter(userId, randomValue, currency);

  console.log('Adding a new item...');
  const response = await DB.put(params).promise();
  return response;
};
