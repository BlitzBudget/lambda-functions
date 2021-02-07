var updateHelper = function () { };

const updateTransaction = require('../update/transaction');

async function updateAllItems(events, event) {
    events.push(updateTransaction.updatingTransactions(event));
    await Promise.all(events).then(function () {
        console.log("successfully saved the new transactions");
    }, function (err) {
        throw new Error("Unable to add the transactions " + err);
    });
}

updateHelper.prototype.updateAllItems = updateAllItems;
// Export object
module.exports = new updateHelper(); 