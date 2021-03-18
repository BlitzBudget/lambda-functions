const FetchDate = () => {};

const dateParameter = require('../create-parameter/date');

FetchDate.prototype.getDateData = async (pk, today, documentClient) => {
  const params = dateParameter.createParameter(pk, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Date: response.Items,
  };
};

// Export object
module.exports = new FetchDate();
