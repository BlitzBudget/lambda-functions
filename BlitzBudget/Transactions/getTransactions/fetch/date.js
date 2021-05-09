function FetchDate() {}

const dateParameter = require('../create-parameter/date');

async function getDateData(pk, year, documentClient) {
  const params = dateParameter.createParameter(pk, year);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return {
    Date: response.Items,
  };
}

FetchDate.prototype.getDateData = getDateData;
// Export object
module.exports = new FetchDate();
