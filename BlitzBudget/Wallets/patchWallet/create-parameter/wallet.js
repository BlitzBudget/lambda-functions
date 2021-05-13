const constants = require('../constants/constant');

module.exports.createParameter = (event, updateExp, expAttrNames, expAttrVal) => ({
  TableName: constants.TABLE_NAME,
  Key: {
    pk: event['body-json'].userId,
    sk: event['body-json'].walletId,
  },
  UpdateExpression: updateExp,
  ExpressionAttributeNames: expAttrNames,
  ExpressionAttributeValues: expAttrVal,

});
