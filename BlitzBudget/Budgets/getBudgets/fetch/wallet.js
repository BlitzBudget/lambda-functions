var wallet = function () {};

wallet.prototype.getWalletsData = (userId, budgetData, docClient) => {
  var params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved - Wallet %j', data.Count);
        organizeWalletData(data);
        budgetData['Wallet'] = data.Items;
        resolve({
          Wallet: data.Items,
        });
      }
    });
  });

  function organizeWalletData(data) {
    if (data.Items) {
      for (const walletObj of data.Items) {
        walletObj.walletId = walletObj.sk;
        walletObj.userId = walletObj.pk;
        delete walletObj.sk;
        delete walletObj.pk;
      }
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
        'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance',
    };
  }
};

// Export object
module.exports = new wallet();
