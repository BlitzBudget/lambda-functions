function AddDate() {}

const addDateParameter = require('../create-parameter/add-date');

async function createDateData(event, skForDate, documentClient) {
  const params = addDateParameter.createParameter(event, skForDate);

  console.log('Adding a new item...');
  const response = await documentClient.update(params).promise();

  return {
    Date: response.Attributes,
  };
}

AddDate.prototype.createDateData = createDateData;
// Export object
module.exports = new AddDate();
