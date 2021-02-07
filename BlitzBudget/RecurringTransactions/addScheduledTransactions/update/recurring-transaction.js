var recurringTransaction = function () { };

/*
 * Update the recurring transaction
 */
function updateRecurringTransactionsData(walletId, sk, futureTransactionCreationDate) {

    var params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": walletId,
            "sk": sk,
        },
        UpdateExpression: "set next_scheduled = :ns, updated_date = :u",
        ExpressionAttributeValues: {
            ":ns": futureTransactionCreationDate,
            ":u": new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
    }

    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
        DB.update(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("successfully updated the recurring transaction %j", data.Attributes.sk);
                resolve(data.Attributes);
            }
        });
    });
}

recurringTransaction.prototype.updateRecurringTransactionsData = updateRecurringTransactionsData;
// Export object
module.exports = new recurringTransaction(); 