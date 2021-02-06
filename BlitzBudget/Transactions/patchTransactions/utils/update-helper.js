
async function updateAllItems(events, event) {
    events.push(updatingTransactions(event));
    await Promise.all(events).then(function () {
        console.log("successfully saved the new transactions");
    }, function (err) {
        throw new Error("Unable to add the transactions " + err);
    });
}