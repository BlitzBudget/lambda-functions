var updateBudget = function () { };

updateBudget.prototype.updatingBankAccounts = (params) => {

    console.log("Updating an item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve({
                    "success": data
                });
            }
        });
    });

}

// Export object
module.exports = new updateBudget();
