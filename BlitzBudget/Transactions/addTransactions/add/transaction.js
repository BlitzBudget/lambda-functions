function addNewTransaction(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
    let randomValue = "Transaction#" + today.toISOString();

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": event['body-json'].walletId,
            "sk": randomValue,
            "amount": event['body-json'].amount,
            "description": event['body-json'].description,
            "category": event['body-json'].category,
            "recurrence": event['body-json'].recurrence,
            "account": event['body-json'].account,
            "date_meant_for": event['body-json'].dateMeantFor,
            "tags": event['body-json'].tags,
            "creation_date": today.toISOString(),
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
                event['body-json'].transactionId = randomValue;
            }
        });
    });

}