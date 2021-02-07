var updateHelper = function () { };

/*
* Update recurring transactions
*/
async function updateRecurringTransaction(walletId, recurringTransactionsId, recurringTransactionsNextSch) {
    events.push(updateRecurringTransactionsData(walletId, recurringTransactionsId, recurringTransactionsNextSch));

    await Promise.all(events).then(function () {
        console.log("Successfully updated the recurring transactions field %j", recurringTransactionsNextSch);
    }, function (err) {
        throw new Error("Unable to update the recurring transactions field " + err);
    });
}

updateHelper.prototype.updateRecurringTransaction = updateRecurringTransaction;
// Export object
module.exports = new updateHelper(); 