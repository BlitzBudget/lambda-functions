const fetchParameter = require('../create-parameter/fetch');

// Get all Items
module.exports.getAllItems = async (walletId, documentClient) => {
  const params = fetchParameter.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  return response;
};
