const DeleteItems = () => {};

DeleteItems.prototype.deleteItems = async (params, DB) => {
  const response = await DB.batchWrite(params).promise();
  return response;
};

// Export object
module.exports = new DeleteItems();
