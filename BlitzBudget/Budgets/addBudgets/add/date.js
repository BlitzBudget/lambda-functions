function AddDate() {}

const dateParameter = require('../create-parameter/add-date');

AddDate.prototype.createDateItem = async (walletId, skForDate, documentClient) => {
  const parameter = dateParameter.createParameter(walletId, skForDate);

  console.log('Adding a new item...');

  const response = await documentClient.update(parameter).promise();
  return {
    Date: response.Attributes,
  };
};

module.exports = new AddDate();
