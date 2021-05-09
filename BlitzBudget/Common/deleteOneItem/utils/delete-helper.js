function DeleteHelper() {}

const deleteItem = require('../delete/item');

async function deleteAnItem(pk, sk, documentClient) {
  await deleteItem.deleteOneItem(pk, sk, documentClient).then(
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
