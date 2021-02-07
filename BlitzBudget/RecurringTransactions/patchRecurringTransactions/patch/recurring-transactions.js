var patchRecurringTransaction = function () { };

const helper = require('../utils/helper');
const parameters = require('../utils/parameters');

function updatingRecurringTransactions(event, docClient) {

    var params = createParameters();

    console.log("Updating an item...");
    return new Promise((resolve, reject) => {
        docClient.update(params, function (err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                event['body-json'].category = data.Attributes.category;
                event['body-json'].amount = data.Attributes.amount;
                resolve({
                    "success": data
                });
            }
        });
    });


    function createParameters() {
         
        let updateExp = "set";
        let expAttrVal = {};
        let expAttrNames = {};

        if (helper.isEmpty(event['body-json'])) {
            return;
        }


        for (let i = 0, len = parameters.length; i < len; i++) {

            let prm = parameters[i];


            // If the parameter is not found then do not save
            if (helper.isEmpty(event['body-json'][prm.prmName])) {
                continue;
            }

            // Add a comma to update expression
            if (helper.includesStr(updateExp, '#variable')) {
                updateExp += ',';
            }

            console.log('param name - ' + event['body-json'][prm.prmName]);

            updateExp += ' #variable' + i + ' = :v' + i;
            expAttrVal[':v' + i] = event['body-json'][prm.prmName];
            expAttrNames['#variable' + i] = prm.prmValue;
        }

        console.log(" update expression ", JSON.stringify(updateExp), " expression attribute value ", JSON.stringify(expAttrVal), ' expression Attribute Names ', JSON.stringify(expAttrNames));
        if (helper.isEmpty(expAttrVal)) {
            return;
        }

        updateExp += ', #update = :u';
        expAttrVal[':u'] = new Date().toISOString();
        expAttrNames['#update'] = 'updated_date';

        return {
            TableName: 'blitzbudget',
            Key: {
                "pk": event['body-json'].walletId,
                "sk": event['body-json'].recurringTransactionId
            },
            UpdateExpression: updateExp,
            ExpressionAttributeNames: expAttrNames,
            ExpressionAttributeValues: expAttrVal,
            ReturnValues: 'ALL_NEW'
        };
    }
}

patchRecurringTransaction.prototype.updatingRecurringTransactions = updatingRecurringTransactions;
// Export object
module.exports = new patchRecurringTransaction(); 