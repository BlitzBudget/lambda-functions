function DeleteItems() {}

const deleteParameter = require('../create-parameter/delete');

DeleteItems.prototype.deleteOneItem = async (pk, sk, documentClient) => {
  console.log(`user Id selected for deletion is ${pk}`);

  const params = deleteParameter.createParameter(pk, sk);

  const response = await documentClient.delete(params).promise();
  return response;
};

// Export object
module.exports = new DeleteItems();
