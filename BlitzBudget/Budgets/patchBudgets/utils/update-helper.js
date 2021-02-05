var updateHelper = function () { };

const parameters = require('parameters');
const fetchHelper = require('fetch-helper');
const helper = require('helper');
const updateBudget = require('../update/budget');

/*
* Check if the budget is present for a newly created category
* For Simultaneous cross device creation compatability
*/
async function updateBudgetIfNotPresent(categoryName, checkIfBudgetIsPresent, event, events, docClient) {
    await fetchHelper.checkIfBudgetAlreadyPresent(categoryName, checkIfBudgetIsPresent, event, docClient);

    await updateBudget(events, event, docClient);
}

async function updateBudget(events, event, docClient) {
    var params = createParametersToUpdate(event);
    events.push(updateBudget.updatingBudgets(params, docClient));

    await Promise.all(events).then(function () {
        console.log("successfully saved the existing Budgets");
    }, function (err) {
        throw new Error("Unable to add the Budgets " + err);
    });
}


function createParametersToUpdate(event) {
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
            "sk": event['body-json'].budgetId,
        },
        UpdateExpression: updateExp,
        ExpressionAttributeNames: expAttrNames,
        ExpressionAttributeValues: expAttrVal
    };
}

updateHelper.prototype.updateBudgetIfNotPresent = updateBudgetIfNotPresent;

// Export object
module.exports = new updateHelper();