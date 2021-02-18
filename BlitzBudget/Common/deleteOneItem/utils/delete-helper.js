const DeleteHelper = () => {};

const deleteItem = require('../delete/item');

async function deleteAnItem(pk, sk, DB) {
  await deleteItem.deleteOneItem(pk, sk, DB).then(
    () => {
      console.log('successfully deleted the item');
    },
    (err) => {
      throw new Error(`Unable to delete the item ${err}`);
    },
  );
}

DeleteHelper.prototype.deleteAnItem = deleteAnItem;

// Export object
module.exports = new DeleteHelper();
