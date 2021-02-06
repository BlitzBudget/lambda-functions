
function markTransactionForCreation(recurringTransaction) {
    console.log("Marking the recurring transaction for creation %j", recurringTransaction.sk);

    if (isEmpty(recurringTransaction.description)) {
        recurringTransaction.description = 'No description';
    }

    let currentTag = isEmpty(recurringTransaction.tags) ? [] : recurringTransaction.tags;

    let params = {
        Message: recurringTransaction.sk,
        MessageAttributes: {
            "category": {
                "DataType": "String",
                "StringValue": recurringTransaction.category
            },
            "next_scheduled": {
                "DataType": "String",
                "StringValue": recurringTransaction['next_scheduled']
            },
            "amount": {
                "DataType": "String",
                "StringValue": recurringTransaction.amount.toString()
            },
            "recurrence": {
                "DataType": "String",
                "StringValue": recurringTransaction.recurrence
            },
            "description": {
                "DataType": "String",
                "StringValue": recurringTransaction.description
            },
            "account": {
                "DataType": "String",
                "StringValue": recurringTransaction.account
            },
            "categoryType": {
                "DataType": "String",
                "StringValue": recurringTransaction['category_type']
            },
            "categoryName": {
                "DataType": "String",
                "StringValue": recurringTransaction['category_name']
            },
            "walletId": {
                "DataType": "String",
                "StringValue": recurringTransaction.pk
            },
            "tags": {
                "DataType": 'String.Array',
                "StringValue": JSON.stringify(currentTag)
            }
        },
        TopicArn: 'arn:aws:sns:eu-west-1:064559090307:addRecurringTransactions'
    };

    return new Promise((resolve, reject) => {
        sns.publish(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve("Reset account to SNS published");
            }
        });
    });
}
