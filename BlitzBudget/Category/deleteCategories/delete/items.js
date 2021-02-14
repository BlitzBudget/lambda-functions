var deleteItems = function () {};

deleteItems.prototype.deleteItems = (params, DB) => {
  return new Promise((resolve, reject) => {
    DB.batchWrite(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('All items are successfully deleted');
        resolve({
          success: data,
        });
      }
    });
  });
};

var deleteItems = function () {};
