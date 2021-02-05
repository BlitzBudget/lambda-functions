var fetchBudget = function () { };

// Get BankAccount Item
fetchBudget.prototype.getBankAccountItem = (walletId) => {
    var params = {
        TableName: 'blitzbudget',
        KeyConditionExpression: "pk = :walletId and begins_with(sk, :items)",
        ExpressionAttributeValues: {
            ":walletId": walletId,
            ":items": "BankAccount#"
        },
        ProjectionExpression: "bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type"
    };

    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                console.log("data retrieved ", JSON.stringify(data.Items));
                resolve({
                    "Account": data.Items
                });
            }
        });
    });
}

// Export object
module.exports = new fetchBudget();