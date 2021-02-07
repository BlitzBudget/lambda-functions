/*
* Send to SNS events
*/
async function sendSNSToCreateNewTransactions(snsEvents) {
    if (isNotEmpty(snsEvents)) {
        await Promise.all(snsEvents).then(function () {
            console.log("Successfully sent the pending recurring transactions for creation");
        }, function (err) {
            throw new Error("Unable to send the pending recurring transactions for creation" + err);
        });
    }
}
