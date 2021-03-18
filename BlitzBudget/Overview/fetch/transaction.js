const FetchTransaction = () => {};

const constants = require('../constants/constant');

// Get Transaction Item
async function getTransactionItems(pk, startsWithDate, endsWithDate, documentClient) {
  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':bt1': `Transaction#${startsWithDate}`,
        ':bt2': `Transaction#${endsWithDate}`,
      },
      ProjectionExpression:
        'amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags',
      ScanIndexForward: false,
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Transaction: response.Items,
  };
}

FetchTransaction.prototype.getTransactionItems = getTransactionItems;
// Export object
module.exports = new FetchTransaction();
