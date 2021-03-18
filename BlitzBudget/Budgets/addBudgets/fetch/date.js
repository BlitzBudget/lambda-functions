const FetchDate = () => {};

const constants = require('../constants/constant');

FetchDate.prototype.getDateData = async (pk, today, docClient) => {
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': pk,
      ':items':
        `Date#${
          today.getFullYear()
        }-${
          (`0${today.getMonth() + 1}`).slice(-2)}`,
    },
    ProjectionExpression: 'pk, sk',
  };

  // Call DynamoDB to read the item from the table
  const response = await docClient.query(params).promise();

  return {
    Date: response.Items,
  };
};

// Export object
module.exports = new FetchDate();
