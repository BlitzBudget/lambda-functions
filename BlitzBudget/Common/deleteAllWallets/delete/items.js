const DeleteItems = () => {};

DeleteItems.prototype.deleteItems = (params, DB) => new Promise((resolve, reject) => {
  DB.batchWrite(params, (err, data) => {
    if (err) {
      console.log('Error ', err);
      reject(err);
    } else {
      resolve({ success: data });
    }
  });
});

// Export object
module.exports = new DeleteItems();
