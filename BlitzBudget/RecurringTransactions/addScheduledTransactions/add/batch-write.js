const BatchWrite = () => {};

/*
 * Batch write all the transactions and dates created
 */
async function batchWriteItems(paramsPartial, DB) {
  const response = await DB.batchWrite(paramsPartial).promise();
  return response;
}

BatchWrite.prototype.batchWriteItems = batchWriteItems;
// Export object
module.exports = new BatchWrite();
