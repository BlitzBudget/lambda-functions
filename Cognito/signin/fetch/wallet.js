function FetchWallet() {}

const walletParameter = require('../create-parameter/wallet');

FetchWallet.prototype.getWallet = async (userId, documentClient) => {
  const params = walletParameter.createParameter(userId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return response.Items;
};

// Export object
module.exports = new FetchWallet();
