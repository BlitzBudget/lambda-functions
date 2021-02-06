/*
* Update recurring transactions
*/
async function updateRecurringTransaction(walletId, recurringTransactionsId) {
    events.push(updateRecurringTransactionsData(walletId, recurringTransactionsId));

    await Promise.all(events).then(function () {
        console.log("Successfully updated the recurring transactions field %j", recurringTransactionsNextSch);
    }, function (err) {
        throw new Error("Unable to update the recurring transactions field " + err);
    });
}