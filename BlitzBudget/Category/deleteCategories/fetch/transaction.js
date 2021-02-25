const FetchTransaction = () => {};

const constants = require('../constants/constant');

// Get all transaction Items
FetchTransaction.prototype.getTransactionItems = (
  walletId,
  currentPeriod,
  DB,
) => {
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': walletId,
      ':items': `Transaction#${currentPeriod}`,
    },
    ProjectionExpression:
      'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    DB.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved ', JSON.stringify(data.Items));
        resolve(data);
      }
    });
  });
};

// Export object
module.exports = new FetchTransaction();
