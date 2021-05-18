module.exports.createParameter = (event, randomValue) => ({
  TableName: process.env.TABLE_NAME,
  Item: {
    pk: event['body-json'].walletId,
    sk: randomValue,
    category: event['body-json'].category,
    planned: event['body-json'].planned,
    auto_generated: false,
    date_meant_for: event['body-json'].dateMeantFor,
    creation_date: new Date().toISOString(),
    updated_date: new Date().toISOString(),
  },
});
