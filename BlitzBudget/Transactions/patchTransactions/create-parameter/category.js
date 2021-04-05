const constants = require('../constants/constant');

module.exports.createParameter = (event, today) => ({
  TableName: constants.TABLE_NAME,
  KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
  ExpressionAttributeValues: {
    ':pk': event['body-json'].walletId,
    ':items':
          `Category#${
            today.getFullYear()
          }-${
            (`0${today.getMonth() + 1}`).slice(-2)}`,
  },
  ProjectionExpression: 'pk, sk, category_name, category_type',
});
