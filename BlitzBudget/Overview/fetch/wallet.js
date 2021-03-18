const FetchWallet = () => {};

const walletParameter = require('../create-parameter/wallet');

async function getWalletData(userId, walletId, documentClient) {
  function organizeRetrievedItems(data) {
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
  const params = walletParameter.createParameters(userId, walletId);

  // Call DynamoDB to read the item from the table

  const response = await documentClient.get(params).promise();

  organizeRetrievedItems(response);
  return ({
    Wallet: response,
  });
}

function getWalletsData(userId, documentClient) {
  function organizeRetrievedItems(data) {
    console.log('data retrieved - Wallet %j', data.Count);
    if (data.Items) {
      Object.keys(data.Items).forEach((walletObj) => {
        const walletData = walletObj;
        walletData.walletId = walletObj.sk;
        walletData.userId = walletObj.pk;
        delete walletData.sk;
        delete walletData.pk;
      });
    }
  }

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': userId,
        ':items': 'Wallet#',
      },
      ProjectionExpression:
        'currency, pk, sk, read_only, total_asset_balance, total_debt_balance, wallet_balance',
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    documentClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        organizeRetrievedItems(data);
        resolve({
          Wallet: data.Items,
        });
      }
    });
  });
}

FetchWallet.prototype.getWalletData = getWalletData;
FetchWallet.prototype.getWalletsData = getWalletsData;
// Export object
module.exports = new FetchWallet();
