function Wallet() {}

const transactionParameter = require('../create-parameter/transaction');
const organizeWallet = require('../organize/wallet');

Wallet.prototype.getWalletsData = async (userId, documentClient) => {
  const params = transactionParameter.createParameter(userId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeWallet.organize(response);
  return {
    Wallet: response.Items,
  };
};

// Export object
module.exports = new Wallet();
