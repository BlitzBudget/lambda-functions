const Wallet = () => {};

function updateWalletBalance(pk, sk, balance, assetBalance, debtBalance, docClient) {
  const params = {
    TableName: 'blitzbudget',
    Key: {
      pk,
      sk,
    },
    UpdateExpression:
      'set Wallet_balance = Wallet_balance + :ab, total_asset_balance = total_asset_balance + :tab, total_debt_balance = total_debt_balance + :dab',
    ConditionExpression: 'attribute_exists(Wallet_balance)',
    ExpressionAttributeValues: {
      ':ab': balance,
      ':tab': assetBalance,
      ':dab': debtBalance,
    },
    ReturnValues: 'NONE',
  };

  console.log('Updating the item...');
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.error(
          'Unable to update item. Error JSON:',
          JSON.stringify(err, null, 2),
        );
        reject(err);
      } else {
        console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
        resolve(data);
      }
    });
  });
}

Wallet.prototype.updateWalletBalance = updateWalletBalance;
// Export object
module.exports = new Wallet();
