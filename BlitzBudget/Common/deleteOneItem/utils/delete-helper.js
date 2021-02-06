var deleteHelper = function () { };

const deleteItem = require('../delete/item');

let deleteAnItem = async function(pk, sk, DB) {
    await deleteItem.deleteOneItem(pk, sk, DB).then(function () {
        console.log("successfully deleted the item");
    }, function (err) {
        throw new Error("Unable to delete the item " + err);
    });
}

deleteHelper.prototype.deleteAnItem = deleteAnItem;

var deleteHelper = function () { };