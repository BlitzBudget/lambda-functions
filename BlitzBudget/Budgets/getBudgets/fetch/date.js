const Date = () => {};

const dateParameter = require('../create-parameter/date');

Date.prototype.getDateData = async (pk, year, documentClient) => {
  const params = dateParameter.createParameters(pk, year);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  return {
    Date: response.Items,
  };
};

// Export object
module.exports = new Date();
