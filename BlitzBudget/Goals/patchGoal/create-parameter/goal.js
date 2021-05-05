const constants = require('../constants/constant');

module.exports.createParameter = (event, updateExp, expAttrNames, expAttrVal) => ({
  TableName: constants.TABLE_NAME,
  Key: {
    pk: event['body-json'].walletId,
    sk: event['body-json'].goalId,
  },
  UpdateExpression: updateExp,
  ExpressionAttributeNames: expAttrNames,
  ExpressionAttributeValues: expAttrVal,
});
