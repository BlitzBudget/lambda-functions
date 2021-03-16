const FetchBudget = () => {};

const constants = require('../constants/constant');

// Get BankAccount Item
FetchBudget.prototype.getBankAccountItem = async (walletId, docClient) => {
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :walletId and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':walletId': walletId,
      ':items': 'BankAccount#',
    },
    ProjectionExpression:
      'bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type',
  };

  // Call DynamoDB to read the item from the table
  const response = await docClient.query(params).promise();
  return {
    Account: response.Items,
  };
};

// Export object
module.exports = new FetchBudget();
