function FetchWallet() {}

const walletParameter = require('../create-parameter/wallet');
const organizeWallet = require('../organize/wallet');

async function getWalletsData(userId, documentClient) {
  const params = walletParameter.createParameter(userId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  organizeWallet.organize(response);
  console.log('data retrieved - Wallet %j', JSON.stringify(response.Items));
  return {
    Wallet: response.Items,
  };
}

FetchWallet.prototype.getWalletsData = getWalletsData;
// Export object
module.exports = new FetchWallet();
