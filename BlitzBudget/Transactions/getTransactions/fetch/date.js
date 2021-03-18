const FetchDate = () => {};

const constants = require('../constants/constant');

async function getDateData(pk, year, documentClient) {
  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':items': `Date#${year}`,
      },
      ProjectionExpression: 'pk, sk, income_total, expense_total, balance',
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return {
    Date: response.Items,
  };
}

FetchDate.prototype.getDateData = getDateData;
// Export object
module.exports = new FetchDate();
