
/*
* Add a new recurring transaction if recurrence is required
*/
function addNewRecurringTransaction(event, events) {
    if (isNotEmpty(event['body-json'].recurrence) && event['body-json'].recurrence != 'NEVER') {
        events.push(addNewRecurringTransaction(event));
    }
}

async function addAllItems(events, event) {
    addNewRecurringTransaction(event, events);

    events.push(addNewTransaction(event));
    
    await Promise.all(events).then(function () {
        console.log("successfully saved the new transaction");
    }, function (err) {
        throw new Error("Unable to add the transactions " + err);
    });
}