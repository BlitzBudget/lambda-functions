function Date() {}

const dateParameter = require('../create-parameter/date');
const organizeDate = require('../organize/date');

Date.prototype.getDateData = async (pk, year, documentClient) => {
  const params = dateParameter.createParameter(pk, year);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeDate.organize(response);
  return {
    Date: response.Items,
  };
};

// Export object
module.exports = new Date();
