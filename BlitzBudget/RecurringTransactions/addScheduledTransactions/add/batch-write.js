function BatchWrite() {}

/*
 * Batch write all the transactions and dates created
 */
async function batchWriteItems(paramsPartial, documentClient) {
  const response = await documentClient.batchWrite(paramsPartial).promise();
  return response;
}

BatchWrite.prototype.batchWriteItems = batchWriteItems;
// Export object
module.exports = new BatchWrite();
