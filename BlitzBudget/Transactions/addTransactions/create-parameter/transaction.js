module.exports.createParameter = (event, randomValue, today) => ({
  TableName: process.env.TABLE_NAME,
  Item: {
    pk: event['body-json'].walletId,
    sk: randomValue,
    amount: event['body-json'].amount,
    description: event['body-json'].description,
    category: event['body-json'].category,
    recurrence: event['body-json'].recurrence,
    account: event['body-json'].account,
    date_meant_for: event['body-json'].dateMeantFor,
    tags: event['body-json'].tags,
    creation_date: today.toISOString(),
    updated_date: new Date().toISOString(),
  },
});
