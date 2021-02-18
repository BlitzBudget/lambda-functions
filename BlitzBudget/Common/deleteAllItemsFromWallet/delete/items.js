const Helper = () => {};

function deleteItems(params, DB) {
  return new Promise((resolve, reject) => {
    DB.batchWrite(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('All items are successfully deleted');
        resolve({ success: data });
      }
    });
  });
}

Helper.prototype.deleteItems = deleteItems;

// Export object
module.exports = new Helper();
