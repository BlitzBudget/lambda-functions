const BatchWrite = () => {};

/*
 * Batch write all the transactions and dates created
 */
function batchWriteItems(paramsPartial, DB) {
  return new Promise((resolve, reject) => {
    DB.batchWrite(paramsPartial, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('successfully added the batch of data to the database');
        resolve({
          success: data,
        });
      }
    });
  });
}

BatchWrite.prototype.batchWriteItems = batchWriteItems;
// Export object
module.exports = new BatchWrite();
