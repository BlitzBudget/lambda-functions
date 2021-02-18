const FetchWallet = () => {};

function getWalletsData(userId, docClient) {
  function organizeTransactionData(data) {
    console.log('data retrieved - Wallet %j', data.Count);
    Object.keys(data.Items).forEach((walletObj) => {
      const wallet = walletObj;
      wallet.walletId = walletObj.sk;
      wallet.userId = walletObj.pk;
      delete wallet.sk;
      delete wallet.pk;
    });
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
        'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance',
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        organizeTransactionData(data);
        resolve({
          Wallet: data.Items,
        });
      }
    });
  });
}

FetchWallet.prototype.getWalletsData = getWalletsData;
// Export object
module.exports = new FetchWallet();
