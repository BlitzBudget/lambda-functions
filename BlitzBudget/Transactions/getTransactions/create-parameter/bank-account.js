module.exports.createParameter = (pk) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': pk,
    ':items': 'BankAccount#',
  },
  ProjectionExpression:
        'bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type,  account_sub_type',
});
