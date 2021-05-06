function FetchDate() {}

const fetchDate = require('../create-parameter/fetch-date');

async function getDateData(pk, today, documentClient) {
  const params = fetchDate.createParameter(pk, today);

  // Call DynamoDB to read the item from the table
  const data = await documentClient.query(params).promise();

  if (data.Count !== 0) {
    return {
      Date: data.Items,
    };
  }

  return {
    dateToCreate: today,
  };
}

FetchDate.prototype.getDateData = getDateData;
// Export object
module.exports = new FetchDate();
