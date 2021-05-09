const constants = require('../constants/constant');

module.exports.createParameter = (event, randomValue) => ({
  TableName: constants.TABLE_NAME,
  Item: {
    pk: event['body-json'].walletId,
    sk: randomValue,
    amount: event['body-json'].amount,
    description: event['body-json'].description,
    category: event['body-json'].category,
    category_type: event['body-json'].categoryType,
    category_name: event['body-json'].categoryName,
    recurrence: event['body-json'].recurrence,
    account: event['body-json'].account,
    tags: event['body-json'].tags,
    next_scheduled: event['body-json'].nextScheduled,
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
});
