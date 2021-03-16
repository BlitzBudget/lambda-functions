const DeleteItems = () => {};

DeleteItems.prototype.DeleteItems = async (params, DB) => {
  const response = DB.batchWrite(params).promise();
  return response;
};

// Export object
module.exports = new DeleteItems();
