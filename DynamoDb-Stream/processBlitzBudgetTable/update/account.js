const UpdateAccount = () => {};

const constants = require('../constants/constant');

async function updateAccountBalanceItem(pk, sk, balance, documentClient) {
  console.log(
    'Updating account balance for the account with walelt Id %j',
    pk,
    ' With sk as ',
    sk,
    ' with the balance ',
    balance,
  );
  const params = {
    TableName: constants.TABLE_NAME,
    Key: {
      pk,
      sk,
    },
    UpdateExpression: 'set account_balance = account_balance + :ab',
    ConditionExpression: 'attribute_exists(account_balance)',
    ExpressionAttributeValues: {
      ':ab': balance,
    },
    ReturnValues: 'UPDATED_NEW',
  };

  console.log('Updating the item...');

  const response = await documentClient.update(params).promise();
  return response;
}

UpdateAccount.prototype.updateAccountBalanceItem = updateAccountBalanceItem;
// Export object
module.exports = new UpdateAccount();
