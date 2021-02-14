var account = function () {};

function updateAccountBalanceItem(pk, sk, balance) {
  console.log(
    'Updating account balance for the account with walelt Id %j',
    pk,
    ' With sk as ',
    sk,
    ' with the balance ',
    balance
  );
  let params = {
    TableName: 'blitzbudget',
    Key: {
      pk: pk,
      sk: sk,
    },
    UpdateExpression: 'set account_balance = account_balance + :ab',
    ConditionExpression: 'attribute_exists(account_balance)',
    ExpressionAttributeValues: {
      ':ab': balance,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  console.log('Updating the item...');
  return new Promise((resolve, reject) => {
    docClient.update(params, function (err, data) {
      if (err) {
        console.error(
          'Unable to update item. Error JSON:',
          JSON.stringify(err, null, 2)
        );
        reject(err);
      } else {
        console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2));
        resolve(data);
      }
    });
  });
}

account.prototype.updateAccountBalanceItem = updateAccountBalanceItem;
// Export object
module.exports = new account();
