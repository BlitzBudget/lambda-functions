module.exports.createParameter = (walletId) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :walletId and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':walletId': walletId,
    ':items': 'BankAccount#',
  },
  ProjectionExpression: 'bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type',
});
