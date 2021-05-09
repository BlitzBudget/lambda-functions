function DeleteItems() {}

DeleteItems.prototype.deleteItems = async (params, documentClient) => {
  const response = await documentClient.batchWrite(params).promise();
  return response;
};

// Export object
module.exports = new DeleteItems();
