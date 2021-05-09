function FetchWallet() {}

const walletParameter = require('../create-parameter/wallet');
const organizeWallet = require('../organize/wallet');

/*
 * Wallet data
 */
FetchWallet.prototype.getWalletData = async function getWalletData(
  userId,
  walletId,
  documentClient,
) {
  console.log(
    'fetching the wallet information for the user %j',
    userId,
    ' with the wallet ',
    walletId,
  );
  const params = walletParameter.createParameter(userId, walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.get(params).promise();

  organizeWallet.organize(response);
  return ({
    Wallet: response,
  });
};

FetchWallet.prototype.getWalletsData = async function getWalletsData(
  userId,
  documentClient,
) {
  const params = walletParameter.createParameterForUserID(userId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeWallet.organize(response);
  return {
    Wallet: response.Items,
  };
};

// Export object
module.exports = new FetchWallet();
