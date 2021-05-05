function FetchDate() {}

const dateParameter = require('../create-parameter/date');
const organizeDate = require('../organize/date');

FetchDate.prototype.getDateData = async function getDateData(
  pk,
  startsWithDate,
  endsWithDate,
  documentClient,
) {
  const params = dateParameter.createParameter(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeDate.organize(response);
  return {
    Date: response.Items,
  };
};

// Export object
module.exports = new FetchDate();
