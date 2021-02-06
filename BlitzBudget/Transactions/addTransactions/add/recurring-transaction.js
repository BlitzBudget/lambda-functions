
function addNewRecurringTransaction(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
    let randomValue = "RecurringTransactions#" + today.toISOString();
    let nextRecurrence = today;

    switch (event['body-json'].recurrence) {
        case 'MONTHLY':
            nextRecurrence.setMonth(nextRecurrence.getMonth() + 1);
            event['body-json'].nextScheduled = nextRecurrence.toISOString();
            break;
        case 'WEEKLY':
            nextRecurrence.setDate(nextRecurrence.getDate() + 7);
            event['body-json'].nextScheduled = nextRecurrence.toISOString();
            break;
        case 'BI-MONTHLY':
            nextRecurrence.setDate(nextRecurrence.getDate() + 15);
            event['body-json'].nextScheduled = nextRecurrence.toISOString();
            break;
    }

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": event['body-json'].walletId,
            "sk": randomValue,
            "amount": event['body-json'].amount,
            "description": event['body-json'].description,
            "category": event['body-json'].category,
            "category_type": event['body-json'].categoryType,
            "category_name": event['body-json'].categoryName,
            "recurrence": event['body-json'].recurrence,
            "account": event['body-json'].account,
            "tags": event['body-json'].tags,
            "next_scheduled": event['body-json'].nextScheduled,
            "creation_date": new Date().toISOString(),
            "updated_date": new Date().toISOString()
        }
    };

    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
        docClient.put(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve({
                    "success": data
                });
                event['body-json'].id = randomValue;
            }
        });
    });

}