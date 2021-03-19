const UpdateDate = () => {};

const dateParameter = require('../create-parameter/date');

async function updateDateItem(pk, sk, difference, income, expense, documentClient) {
  const params = dateParameter.createParameter(pk, sk, difference, income, expense);

  console.log('Updating the item...');

  const response = await documentClient.update(params).promise();
  return response;
}

UpdateDate.prototype.updateDateItem = updateDateItem;
// Export object
module.exports = new UpdateDate();
