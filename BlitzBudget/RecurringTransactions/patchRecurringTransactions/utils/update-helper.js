async function updateRecurringTransaction(events, event, docClient) {
    events.push(updatingRecurringTransactions(event, docClient));
    await Promise.all(events).then(function () {
        console.log("successfully saved the new transactions");
    }, function (err) {
        throw new Error("Unable to add the transactions " + err);
    });
}