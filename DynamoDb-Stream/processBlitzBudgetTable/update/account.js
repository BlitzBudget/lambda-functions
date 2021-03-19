const UpdateAccount = () => {};

const accountParameter = require('../create-parameter/account');

async function updateAccountBalanceItem(pk, sk, balance, documentClient) {
  console.log('Updating account balance for the account with walelt Id %j', pk, ' With sk as ', sk, ' with the balance ', balance);
  const params = accountParameter.createParameter(pk, sk, balance);

  console.log('Updating the item...');

  const response = await documentClient.update(params).promise();
  return response;
}

UpdateAccount.prototype.updateAccountBalanceItem = updateAccountBalanceItem;
// Export object
module.exports = new UpdateAccount();
