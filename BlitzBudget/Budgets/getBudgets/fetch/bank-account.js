var bankAccount = function () { };

bankAccount.prototype.getBankAccountData = (pk, budgetData, docClient) => {
    var params = createParameters();

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                organizeAccountData(data);
                budgetData['BankAccount'] = data.Items;
                resolve({
                    "BankAccount": data.Items
                });
            }
        });
    });

    function organizeAccountData(data) {
        console.log("data retrieved - Bank Account %j", data.Count);
        if (data.Items) {
            for (const accountObj of data.Items) {
                accountObj.accountId = accountObj.sk;
                accountObj.walletId = accountObj.pk;
                delete accountObj.sk;
                delete accountObj.pk;
            }
        }
    }

    function createParameters() {
        return {
            TableName: 'blitzbudget',
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": pk,
                ":items": "BankAccount#"
            },
            ProjectionExpression: "bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type"
        };
    }
}

// Export object
module.exports = new bankAccount();