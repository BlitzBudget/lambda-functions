const fetchParameter = require('../create-parameter/fetch');

// Get all Items
module.exports.getAllItems = async (walletId, DB) => {
  const params = fetchParameter.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await DB.query(params).promise();
  return response;
};
