var deleteItems = function () {};

deleteItems.prototype.deleteOneItem = (pk, sk, DB) => {
  console.log('user Id selected for deletion is ' + pk);

  var params = {
    TableName: 'blitzbudget',
    Key: {
      pk: pk,
      sk: sk,
    },
  };

  return new Promise((resolve, reject) => {
    DB.delete(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({success: data});
      }
    });
  });
};

// Export object
module.exports = new deleteItems();
