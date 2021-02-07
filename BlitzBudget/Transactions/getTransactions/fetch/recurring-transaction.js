var recurringTransaction = function () { };

// Get Budget Item
function getRecurringTransactions(walletId, docClient, snsEvents, sns) {
    var params = createParameters();

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                organizeRecurringTransactionItem(data);
                resolve({
                    "RecurringTransactions": data.Items
                });
            }
        });
    });

    function organizeRecurringTransactionItem(data) {
        console.log("data retrieved - RecurringTransactions ", data.Count);
        let today = new Date();
        for (const rtObj of data.Items) {
            let scheduled = new Date(rtObj['next_scheduled']);
            if (scheduled < today) {
                snsEvents.push(markTransactionForCreation(rtObj, sns));
            }
            rtObj.recurringTransactionsId = rtObj.sk;
            rtObj.walletId = rtObj.pk;
            delete rtObj.sk;
            delete rtObj.pk;
        }
        transactionData['RecurringTransactions'] = data.Items;
    }

    function createParameters() {
        return {
            TableName: 'blitzbudget',
            KeyConditionExpression: "pk = :walletId AND begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":walletId": walletId,
                ":items": "RecurringTransactions#"
            },
            ProjectionExpression: "sk, pk, amount, description, category, recurrence, account, next_scheduled, tags, creation_date, category_type, category_name"
        };
    }
}

recurringTransaction.prototype.getRecurringTransactions = getRecurringTransactions;
// Export object
module.exports = new recurringTransaction(); 