function Wallet() {}

const constants = require('../constants/constant');

Wallet.prototype.createParameter = (userId) => ({
  TableName: process.env.TABLE_NAME,
  KeyConditionExpression: constants.KEY_CONDITION_EXPRESSION,
  ExpressionAttributeValues: {
    ':userId': userId,
    ':items': constants.WALLET_ID_PREFIX,
  },
  ProjectionExpression: constants.PROPERTIES_TO_FETCH,
});

// Export object
module.exports = new Wallet();
