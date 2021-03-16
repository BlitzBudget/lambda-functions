const Date = () => {};

const constants = require('../constants/constant');

Date.prototype.getDateData = async (pk, year, docClient) => {
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
  const response = await docClient.query(params).promise();

  return {
    Date: response.Items,
  };
};

// Export object
module.exports = new Date();
