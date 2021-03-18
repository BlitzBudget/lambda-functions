const FetchWallet = () => {};

const walletParameter = require('../create-parameter/wallet');

/*
 * Wallet data
 */
FetchWallet.prototype.getWalletData = async function getWalletData(
  userId,
  walletId,
  documentClient,
) {
  function organizeRetrivedItems(data) {
    console.log('data retrieved - Wallet %j', JSON.stringify(data));
    if (data.Item) {
      const item = data.Item;
      item.walletId = data.Item.sk;
      item.userId = data.Item.pk;
      delete item.sk;
      delete item.pk;
    }
  }

  console.log(
    'fetching the wallet information for the user %j',
    userId,
    ' with the wallet ',
    walletId,
  );
  const params = walletParameter.createParameter(userId, walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.get(params).promise();

  organizeRetrivedItems(response);
  return ({
    Wallet: response,
  });
};

FetchWallet.prototype.getWalletsData = async function getWalletsData(
  userId,
  documentClient,
) {
  function organizeRetrivedItems(data) {
    console.log('data retrieved - Wallet %j', data.Count);
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

  function createParameter() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': userId,
        ':items': 'Wallet#',
      },
      ProjectionExpression:
        'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance',
    };
  }

  const params = createParameter();

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeRetrivedItems(response);
  return {
    Wallet: response.Items,
  };
};

// Export object
module.exports = new FetchWallet();
