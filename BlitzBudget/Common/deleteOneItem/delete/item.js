const DeleteItems = () => {};

DeleteItems.prototype.deleteOneItem = (pk, sk, DB) => {
  console.log(`user Id selected for deletion is ${pk}`);

  const params = {
    TableName: 'blitzbudget',
    Key: {
      pk,
      sk,
    },
  };

  return new Promise((resolve, reject) => {
    DB.delete(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({ success: data });
      }
    });
  });
};

// Export object
module.exports = new DeleteItems();
