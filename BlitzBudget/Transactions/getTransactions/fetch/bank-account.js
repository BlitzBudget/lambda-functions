
function getBankAccountData(pk, docClient) {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":pk": pk,
            ":items": "BankAccount#"
        },
        ProjectionExpression: "bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type,  account_sub_type"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved - Bank Account %j", data.Count);
                for (const accountObj of data.Items) {
                    accountObj.accountId = accountObj.sk;
                    accountObj.walletId = accountObj.pk;
                    delete accountObj.sk;
                    delete accountObj.pk;
                }
                transactionData['BankAccount'] = data.Items;
                resolve({
                    "BankAccount": data.Items
                });
            }
        });
    });
}