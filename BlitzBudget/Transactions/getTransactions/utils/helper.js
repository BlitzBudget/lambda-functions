var helper = function () { };

function extractVariablesFromRequest(event) {
    let userId = event['body-json'].userId;
    let walletId = event['body-json'].walletId;
    let startsWithDate = event['body-json'].startsWithDate;
    let endsWithDate = event['body-json'].endsWithDate;
    return { startsWithDate, endsWithDate, walletId, userId };
}


function calculateDateAndCategoryTotal(fullMonth) {
    let categoryList = {};
    let incomeTotal = 0,
        expenseTotal = 0,
        periodBalance = 0;

    organizeTransactionItems();

    organizeCategoryItems();

    organizeDateItems();

    /*
     * Assuming the category total will be equal to the transactions added
     */
    organizeBudgetItems();

    transactionData.incomeTotal = incomeTotal;
    transactionData.expenseTotal = expenseTotal;
    transactionData.balance = periodBalance;

    function organizeBudgetItems() {
        for (const budgetObj of transactionData.Budget) {
            budgetObj.planned = budgetObj.planned * percentage;
            if (isNotEmpty(categoryList[budgetObj.category])) {
                budgetObj.used = categoryList[budgetObj.category];
            } else {
                budgetObj.used = 0;
            }
            budgetObj.budgetId = budgetObj.sk;
            budgetObj.walletId = budgetObj.pk;
            delete budgetObj.sk;
            delete budgetObj.pk;
        }
    }

    function organizeDateItems() {
        for (const dateObj of transactionData.Date) {
            dateObj.dateId = dateObj.sk;
            dateObj.walletId = dateObj.pk;
            delete dateObj.sk;
            delete dateObj.pk;
        }
    }

    function organizeCategoryItems() {
        for (const categoryObj of transactionData.Category) {
            if (isNotEmpty(categoryList[categoryObj.sk]) && !fullMonth) {
                categoryObj['category_total'] = categoryList[categoryObj.sk];
            }

            if (isEqual(categoryObj['category_type'], 'Income')) {
                incomeTotal += categoryObj['category_total'];
            } else if (isEqual(categoryObj['category_type'], 'Expense')) {
                expenseTotal += categoryObj['category_total'];
            }
            periodBalance = incomeTotal + expenseTotal;
            categoryObj.categoryId = categoryObj.sk;
            categoryObj.walletId = categoryObj.pk;
            delete categoryObj.sk;
            delete categoryObj.pk;
        }
    }

    function organizeTransactionItems() {
        for (const transObj of transactionData.Transaction) {
            if (isEmpty(categoryList[transObj.category])) {
                categoryList[transObj.category] = transObj.amount;
            } else {
                categoryList[transObj.category] += transObj.amount;
            }
            transObj.transactionId = transObj.sk;
            transObj.walletId = transObj.pk;
            delete transObj.sk;
            delete transObj.pk;
        }
    }
}


/*
 * Calculate difference between startdate and end date
 */
function isFullMonth(startsWithDate, endsWithDate) {
    startsWithDate = new Date(startsWithDate);
    endsWithDate = new Date(endsWithDate);

    if (isNotEqual(startsWithDate.getMonth(), endsWithDate.getMonth()) || isNotEqual(startsWithDate.getFullYear(), endsWithDate.getFullYear())) {
        console.log("The month and the year do not coincide");
        return false;
    }

    let firstDay = new Date(startsWithDate.getFullYear(), startsWithDate.getMonth());
    let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth() + 1, 0);

    if (isEqual(firstDay.getDate(), startsWithDate.getDate()) && isEqual(lastDay.getDate(), endsWithDate.getDate())) {
        return true;
    }

    // Calculate oercentage only if the start date and end date is the same month and year, Else the percentage will be applied for all months
    percentage = (endsWithDate.getDate() - startsWithDate.getDate()) / (lastDay.getDate() - firstDay.getDate());
    console.log("Percentage of budget total to be calculated is %j", percentage);
    return false;
}


function isEmpty(obj) {
    // Check if objext is a number or a boolean
    if (typeof (obj) == 'number' || typeof (obj) == 'boolean') return false;

    // Check if obj is null or undefined
    if (obj == null || obj === undefined) return true;

    // Check if the length of the obj is defined
    if (typeof (obj.length) != 'undefined') return obj.length == 0;

    // check if obj is a custom obj
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }

    return true;
}

function isNotEmpty(obj) {
    return !isEmpty(obj);
}

function isEqual(obj1, obj2) {
    if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
        return true;
    }
    return false;
}

function isNotEqual(obj1, obj2) {
    return !isEqual(obj1, obj2);
}

helper.prototype.isNotEqual = isNotEqual;
helper.prototype.isEqual = isEqual;
helper.prototype.isNotEmpty = isNotEmpty;
helper.prototype.isEmpty = isEmpty;
helper.prototype.isFullMonth = isFullMonth;
helper.prototype.calculateDateAndCategoryTotal = calculateDateAndCategoryTotal;
helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;
// Export object
module.exports = new helper(); 