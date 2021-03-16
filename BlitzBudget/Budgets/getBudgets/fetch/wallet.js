const Wallet = () => {};

const constants = require('../constants/constant');

Wallet.prototype.getWalletsData = async (userId, docClient) => {
  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': userId,
        ':items': 'Wallet#',
      },
      ProjectionExpression:
        'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance',
    };
  }

  function organizeWalletData(data) {
    if (data.Items) {
      Object.keys(data.Items).forEach((walletObj) => {
        const wallet = walletObj;
        wallet.walletId = walletObj.sk;
        wallet.userId = walletObj.pk;
        delete wallet.sk;
        delete wallet.pk;
      });
    }
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  const response = docClient.query(params).promise();

  organizeWalletData(response);
  return {
    Wallet: response.Items,
  };
};

// Export object
module.exports = new Wallet();
