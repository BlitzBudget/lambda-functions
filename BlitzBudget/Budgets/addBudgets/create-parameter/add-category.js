const constants = require('../constants/constant');

module.exports.createParameter = (event) => ({
  TableName: constants.TABLE_NAME,
  Key: {
    pk: event['body-json'].walletId,
    sk: event['body-json'].categoryId,
  },
  UpdateExpression: 'set category_total = :r, category_name = :p, category_type = :q, date_meant_for = :s, creation_date = :c, updated_date = :u',
  ExpressionAttributeValues: {
    ':r': 0,
    ':p': event['body-json'].categoryName,
    ':q': event['body-json'].categoryType,
    ':s': event['body-json'].dateMeantFor,
    ':c': new Date().toISOString(),
    ':u': new Date().toISOString(),
  },
  ReturnValues: 'ALL_NEW',
});
