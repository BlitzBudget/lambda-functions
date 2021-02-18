const FetchWallet = () => {};

FetchWallet.prototype.getWallet = (userId, docClient) => {
  const params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :userId and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':userId': userId,
      ':items': 'Wallet#',
    },
    ProjectionExpression:
      'currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved ', data.Count);
        Object.keys(data.Items).forEach((walletObj) => {
          const wallet = walletObj;
          wallet.walletId = walletObj.sk;
          wallet.userId = walletObj.pk;
          delete wallet.sk;
          delete wallet.pk;
        });
        resolve(data.Items);
      }
    });
  });
};

// Export object
module.exports = new FetchWallet();
