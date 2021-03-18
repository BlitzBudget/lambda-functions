const Helper = () => {};

async function deleteItems(params, DB) {
  const response = await DB.batchWrite(params).promise();
  return response;
}

Helper.prototype.deleteItems = deleteItems;

// Export object
module.exports = new Helper();
