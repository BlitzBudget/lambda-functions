module.exports.createParameter = (event, sk, categoryName) => ({
  TableName: process.env.TABLE_NAME,
  Key: {
    pk: event['body-json'].walletId,
    sk,
  },
  UpdateExpression:
        'set category_total = :r, category_name = :p, category_type = :q, date_meant_for = :s, creation_date = :c, updated_date = :u',
  ExpressionAttributeValues: {
    ':r': 0,
    ':p': categoryName,
    ':q': event['body-json'].categoryType,
    ':s': event['body-json'].dateMeantFor,
    ':c': new Date().toISOString(),
    ':u': new Date().toISOString(),
  },
  ReturnValues: 'ALL_NEW',
});
