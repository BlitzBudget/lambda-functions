var blitzbudgetDB = function () { };

const dbHelper = require('./dbHelper');
const currencyInfo = require('./currency');
const TABLE_NAME = "blitzbudget";
const YOU_EARNED = 'You earned ';
const SUCCESS_SPENT = 'You spent ';
const SUCCESS_WALLET_TWO = ' wallet.';
const SUCCESS_WALLET_ONE = 'Successfully added a ';
const SUCCESS_TRANSACTION_TOTAL = 'You transaction total is ';
const SUCCESS_ADDED_GOAL = 'Successfully added a new goal for ';
const SUCCESS_BUDGET_ADD = 'Successfully added a new budget for ';
const ADDED_NEW_CATEGORY = 'Successfully added a new category for ';
const ADDED_NEW_TRANSACTION = 'Successfully added a new transaction for ';
const BUDGET_AMOUNT_SUCCESS = 'Successfully updated the budget amount to ';
const SUCCESS_DEFAULT_ACCOUNT = 'Successfully updated the default account to ';
const SUCCESSFUL_DEFAULT_WALLET = 'Successfully updated the default wallet to ';
const ERROR_ADDING_CATEGORY = 'Error adding a new category. Please try again later!';
const ERROR_ADDING_GOAL = 'There was an error while adding a new goal! Please try again later.';
const ERROR_BUDGET_ADD = 'There was an error while adding a new budget! Please try again later.';
const DEFAULT_ACCOUNT_NOTPRESENT = 'You do not have a default account in assigned to your wallet!';
const ERROR_ADDING_WALLET = 'There was an error while adding a new wallet! Please try again later.';
const ERROR_EARNED = 'We couldn\'t calculate your earnings at this moment. Please try again later!';
const WALLET_NOT_PRESENT = 'The requested wallet is not present. Do you want me to create them for you?';
const ACCOUNT_NOT_PRESENT = 'The requested account is not present. Do you want me to create them for you?';
const ERROR_BUDGET_AMOUNT = 'There was an error while updating the budget amount! Please try again later.';
const ERROR_EXPENDITURE = 'We couldn\'t calculate your expenditure at this moment. Please try again later!';
const ERROR_ADDING_TRANSACTION = 'There was an error while adding a new transaction! Please try again later.';
const CHANGING_DEFAULT_WALLET = 'Oops! there was an error changing the default wallet. Please try again later!';
const ERROR_CHANGING_ACCOUNT = 'Oops! there was an error changing the default account. Please try again later!';
const ERROR_TRANSACTION_TOTAL = 'We couldn\'t calculate your transaction total at this moment. Please try again later!';

/*
* Fetch all default wallets
*/
blitzbudgetDB.prototype.getDefaultAlexaWallet = async function(userId) {
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: userId
                },
                ":items": {
                  S: "Wallet#"
                }
            },
            ProjectionExpression: "currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance, default_alexa"
        }
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the wallet information from the DynamoDB. Item count is ' + data.length);
        let wallet = data[0];
        // If length is empty
        if(isNotEmpty(data)) {
            for(let i=0, len=data.length; i<len; i++) {
                let item = data[i];
                if(isNotEmpty(item['default_alexa']) && item['default_alexa'].BOOL) {
                    wallet = item;
                }
            }   
        }
        return wallet;
      })
      .catch((err) => {
        console.log("There was an error fetching the default wallet ", err);
        return;
      })
}

/*
* Fetch all default accounts
*/
blitzbudgetDB.prototype.getDefaultAlexaAccount = async function(walletId) {
    return await getDefaultAccount(walletId);
}

/*
* Fetch all category
*/
blitzbudgetDB.prototype.getCategoryAlexa = async function(walletId, categoryName, date) {
    console.log('The Category name is ', categoryName, ' and the date is ', date);
    let selectedDate;
    if(isEmpty(date)) {
        let currentDate =  new Date();
        selectedDate = currentDate.getFullYear() + '-' + ("0" + (Number(currentDate.getMonth()) + 1)).slice(-2);
        console.log('The date is empty, assigning the current date ', selectedDate,' for the wallet ', walletId);
    } else {
        selectedDate = date.substring(0,7);
    }
    
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "Category#" + selectedDate
                }
            },
            ProjectionExpression: "pk, sk, category_name, category_total, category_type"
        }
        
    console.log("Fetching the category with DynamoDB params ", params);
        
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the category information from the DynamoDB. Item count is ' + data.length);
        let category;
        // If length is not empty
        if(isNotEmpty(data)) {
            for(let i=0, len=data.length; i<len; i++) {
                let item = data[i];
                if(isEqual(item['category_name'].S.toUpperCase(), categoryName.toUpperCase())) {
                    category = item;
                    console.log("The category balance of ", categoryName, " has the balance of ", category['category_total'].N);
                }
            }
        }
        return category;
      })
      .catch((err) => {
        console.log("There was an error getting the category from DynamoDB ", err);
        return;
      })
}

/*
* Fetch all budget
*/
blitzbudgetDB.prototype.getBudgetAlexaAmount = async function(walletId, categoryId, selectedDate) {
    console.log(' The date chosen for getting the budget with wallet', walletId, ' is ', selectedDate);
    
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "Budget#" + selectedDate
                }
            },
            ProjectionExpression: "category, planned, sk, pk"
        }
        
    console.log("Fetching the budgets with DynamoDB params ", params);
        
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the budget information from the DynamoDB. Item count is ' + data.length);
        let budget;
        // If length is not empty
        if(isNotEmpty(data)) {
            for(let i=0, len=data.length; i<len; i++) {
                let item = data[i];
                if(isEqual(item['category'].S, categoryId)) {
                    budget = item;
                    console.log("The budget has a balance of ", budget['planned'].N);
                }
            }
        }
        return budget;
      })
      .catch((err) => {
        console.log("There was an error getting the budget amount from DynamoDB ", err);
        return;
      })
}

blitzbudgetDB.prototype.getTagAlexaBalance = async function(walletId, tagName, selectedDate) {
    console.log(' The date chosen for getting the transaction with wallet', walletId, ' is ', selectedDate);
    
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "Transaction#" + selectedDate
                }
            },
            ProjectionExpression: "amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags"
        }
        
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the transaction information from the DynamoDB. Item count is ' + data.length);
        let tagBal = 0;
        // If length is not empty
        if(isNotEmpty(data)) {
            for(let i=0, len=data.length; i<len; i++) {
                let item = data[i];
                // If tag is not present then continue with the loop
                if(isEmpty(item['tags'])) {
                    continue;
                }
                
                let tags = item['tags'].L;
                for(let j=0, leng=tags.length; j<leng; j++) {
                    let tag = tags[j];
                    if(isEqual(tag.S.toUpperCase(), tagName.toUpperCase())) {
                        tagBal += Number(item['amount'].N);
                        // Break the tags for loop
                        break;
                    }   
                }
            }
        }
        
        return tagBal;
      })
      .catch((err) => {
          console.log("There was an error fetching the tag balance ", err);
        return;
      })
}

blitzbudgetDB.prototype.getWalletFromAlexa = async function(userId) {
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: userId
                },
                ":items": {
                  S: "Wallet#"
                }
            },
            ProjectionExpression: "currency, pk, sk, total_asset_balance, total_debt_balance, wallet_balance, default_alexa"
        }
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the wallet information from the DynamoDB. Item count is ' + data.length);
        return data;
        
      })
      .catch((err) => {
        console.log("There was an error getting the wallet from DynamoDB ", err);
        return;
      })
}

blitzbudgetDB.prototype.changeDefaultWalletAlexa = async function(userId, data, currencyName) {
    let events = [], say;
    // If length is empty
    if(isNotEmpty(data)) {
        for(let i=0, len=data.length; i<len; i++) {
            let item = data[i];
            console.log("Default Alexa is ", item['default_alexa']);
            if(isNotEmpty(item['default_alexa']) && item['default_alexa'].BOOL) {
                events.push(patchWallet(userId, item.sk.S, false));
            }
        }
        
        for(let i=0, len=data.length; i<len; i++) {
            let item = data[i];
            if(isEqual(item.currency.S.toUpperCase(), currencyName.toUpperCase())) {
                console.log("Potential match of wallet found with currency, ", currencyName, " having a wallet id as ", item.sk.S);
                events.push(patchWallet(userId, item.sk.S, true));
            }
        }
    }
    
    /*
    * Is Empty Events 
    */
    if(isEmpty(events)) {
        say = WALLET_NOT_PRESENT;
    } else {
        /*
        * Patch Wallet
        */
        await Promise.all(events).then(function (result) {
            console.log("Successfully updated the wallet information");
            say = SUCCESSFUL_DEFAULT_WALLET + currencyName;
        }, function (err) {
            throw new Error("Unable error occured while fetching the Wallet " + err);
            say = CHANGING_DEFAULT_WALLET;
        });   
    }
    
    return say;
}

blitzbudgetDB.prototype.getAccountFromAlexa  = async function(walletId) {
    console.log("The account information to retrieve from wallet is", walletId);
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "BankAccount#"
                }
            },
            ProjectionExpression: "bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type"
        }
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the account information from the DynamoDB. Item count is ' + data.length);
        return data;
        
      })
      .catch((err) => {
        console.log("There was an error getting the account from DynamoDB ", err);
        return;
      })
}

blitzbudgetDB.prototype.changeDefaultAccountAlexa = async function(allAccounts, accountName) {
    let events = [], say, data = allAccounts;
    
    // If length is empty
    if(isNotEmpty(data)) {
        for(let i=0, len=data.length; i<len; i++) {
            let item = data[i];
            // Selected Account Boolean
            if(isNotEmpty(item['selected_account']) && item['selected_account'].BOOL) {
                console.log("The default selected account to change to false is ", item['bank_account_name'].S);
                events.push(patchAccount(item.pk.S, item.sk.S, false));
            }
        }
        
        for(let i=0, len=data.length; i<len; i++) {
            let item = data[i];
            if(isEqual(item['bank_account_name'].S.toUpperCase(), accountName.toUpperCase())) {
                events.push(patchAccount(item.pk.S, item.sk.S, true));
            }
        }
    }
    
    /*
    * Is Empty Events 
    */
    if(isEmpty(events) || events.length == 1) {
        say = ACCOUNT_NOT_PRESENT;
    } else {
        /*
        * Patch Wallet
        */
        await Promise.all(events).then(function (result) {
            console.log("Successfully updated the account information");
            say = SUCCESS_DEFAULT_ACCOUNT + accountName;
        }, function (err) {
            console.log("Unable error occured while fetching the account " + err);
            say = ERROR_CHANGING_ACCOUNT;
        });   
    }

    return say;
}

blitzbudgetDB.prototype.calculateWalletFromAlexa = function(allWallets, slotValues) {
    let data = allWallets, wallet, walletCurrency;
    
    if (slotValues.currency.ERstatus === 'ER_SUCCESS_MATCH') {
        if(slotValues.currency.resolved !== slotValues.currency.heardAs) {
            walletCurrency = slotValues.currency.resolved; 
        } else {
            walletCurrency = slotValues.currency.heardAs;
        } 
    }
    if (slotValues.currency.ERstatus === 'ER_SUCCESS_NO_MATCH') {
        console.log('***** consider adding "' + slotValues.currency.heardAs + '" to the custom slot type used by slot category! '); 
    } else {
        // If length is empty
        if(isNotEmpty(data)) {
            for(let i=0, len=data.length; i<len; i++) {
                let item = data[i];
                if(isEqual(item['currency'].S.toUpperCase(), walletCurrency.toUpperCase())) {
                    wallet = item;
                }
            }
        }    
    }
    
    console.log("The wallet information calculated is ", wallet);
    return wallet;
}

blitzbudgetDB.prototype.changeBudgetAlexaAmount = async function(walletId, budgetId, amount, currencyName) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            "pk":  {
                S: walletId
            },
            "sk": {
                S: budgetId
            }
        },
        UpdateExpression: 'set #variable1 = :v1, #update = :u',
        ExpressionAttributeNames: {
            "#variable1": "planned",
            "#update": "updated_date"
        },
        ExpressionAttributeValues: {
            ":v1": {
                N: amount
            },
            ":u": {
                S: new Date().toISOString()
            }
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the budget with a default alexa property ", JSON.stringify(params));
                
    return dbHelper.patchFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the budget information from the DynamoDB. Item count is ' + data.length);
        return BUDGET_AMOUNT_SUCCESS + amount + ' ' + currencyName;
        
      })
      .catch((err) => {
        console.log("There was an error changing the budget from DynamoDB ", err);
        return ERROR_BUDGET_AMOUNT;
      })
}

blitzbudgetDB.prototype.checkIfWalletIsInvalid = function(slotValues) {
    let walletCurrency, matchedCurrency;
    if (slotValues.currency.ERstatus === 'ER_SUCCESS_MATCH') {
        if(slotValues.currency.resolved !== slotValues.currency.heardAs) {
            walletCurrency = slotValues.currency.resolved; 
        } else {
            walletCurrency = slotValues.currency.heardAs;
        } 
    }
    if (slotValues.currency.ERstatus === 'ER_SUCCESS_NO_MATCH') {
        console.log('***** consider adding "' + slotValues.currency.heardAs + '" to the custom slot type used by slot category! '); 
    } 
    
    for(let i=0, len=currencyInfo.length; i<len; i++) {
        let defaultCurrency = currencyInfo[i];
        if(isEqual(defaultCurrency.currency.toUpperCase(),walletCurrency.toUpperCase())) {
            matchedCurrency = defaultCurrency.currency;
        }
    }
    
    return matchedCurrency;
}

blitzbudgetDB.prototype.addWalletFromAlexa = async function(userId, currency) {
    
    let today = new Date();
    let randomValue = "Wallet#" + today.toISOString(); 
    
    var params = {
        TableName:'blitzbudget',
        Item:{
            "pk": {
                S: userId
            },
            "sk": {
                S: randomValue
            },
            "currency": {
                S: currency
            },
            "wallet_balance": {
                N: "0"
            },
            "total_asset_balance": {
                N: "0"
            },
            "total_debt_balance": {
                N: "0"
            },
            "creation_date": {
                S: new Date().toISOString()
            },
            "updated_date": {
                S: new Date().toISOString()
            }
        }
    };
    
    console.log("Adding a wallet with a default alexa property ", JSON.stringify(params));
                
    return dbHelper.addToBlitzBudgetTable(params).then((data) => {
        console.log('Successfully added the wallet to the DynamoDB. Item count is ' + data.length);
        return SUCCESS_WALLET_ONE + currency + SUCCESS_WALLET_TWO;
        
      })
      .catch((err) => {
         console.log("There was an error adding a new wallet from DynamoDB ", err);
        return ERROR_ADDING_WALLET;
      })
}

blitzbudgetDB.prototype.addBudgetAlexaAmount = async function(walletId, categoryId, amount, currentDate, categoryName) {
    let today = new Date(), dateId;
    let randomValue = "Budget#" + today.toISOString(); 
    let dateObj = await getDateData(walletId, currentDate);
    
    // If Date is not empty
    if(isNotEmpty(dateObj)) {
        dateId = dateObj[0].sk.S;
    } else {
        dateId = "Date#" + today.toISOString();
        dateObj = await createDateData(walletId, dateId);
    }
    
    // If Amount if empty
    if(isEmpty(amount)) {
        amount = "0";
    }

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": {
                S: walletId
            },
            "sk": {
                S: randomValue
            },
            "category": {
                S: categoryId
            },
            "planned": {
                N: amount
            },
            "auto_generated": {
                BOOL: false
            },
            "date_meant_for": {
                S: dateId
            },
            "creation_date": {
                S: new Date().toISOString()
            },
            "updated_date": {
                S: new Date().toISOString()
            }
        }
    };
    
    console.log("The add budget has the params ", JSON.stringify(params));
    
    return dbHelper.addToBlitzBudgetTable(params).then((data) => {
        console.log('Successfully added the budget to the DynamoDB.');
        return SUCCESS_BUDGET_ADD + categoryName;
      })
      .catch((err) => {
        console.log("There was an error adding a new budget from DynamoDB ", err);
        return ERROR_BUDGET_ADD;
      })
    
}

blitzbudgetDB.prototype.addNewGoalFromAlexa = async function(walletId, amount, goalType, monthlyContribution, targetDate) {
    let today = new Date();
    let randomValue = "Goal#" + today.toISOString();
    targetDate = new Date(targetDate);
    
    if(isEmpty(amount)) {
        amount = "0";
    }

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": {
                S: walletId
            },
            "sk": {
                S: randomValue
            },
            "goal_type": {
                S: goalType
            },
            "final_amount": {
                N: amount
            },
            "preferable_target_date": {
                S: targetDate.toISOString()
            },
            "actual_target_date": {
                S: targetDate.toISOString()
            },
            "monthly_contribution": {
                S: monthlyContribution
            },
            "target_id": {
                S: walletId
            },
            "target_type": {
                S: "Wallet"
            },
            "creation_date": {
                S: new Date().toISOString()
            },
            "updated_date": {
                S: new Date().toISOString()
            }
        }
    };
    
    console.log("A new goal has the params ", params);
    
    return dbHelper.addToBlitzBudgetTable(params).then((data) => {
        console.log('Successfully added the goal to the DynamoDB.');
        return SUCCESS_ADDED_GOAL + goalType;
      })
      .catch((err) => {
        console.log("There was an error adding a new goal from DynamoDB ", err);
        return ERROR_ADDING_GOAL;
      })
}

blitzbudgetDB.prototype.addTransactionAlexaAmount = async function(walletId, categoryId, amount, dateId, currencyName) {
    let today = new Date();
    // Date used to get the budget
    if(isNotEmpty(dateId)) {
        let chosenYear = dateId.slice(0,4);
        today.setFullYear(chosenYear);
        
        // If month is present
        if(dateId.length > 4) {
            let chosenMonth = dateId.slice(5,7);
            // Javascript month is 0 -11 while alexa is 0-12
            chosenMonth = Number(chosenMonth) - 1;
            today.setMonth(chosenMonth);
        }
        
        // If date is present then
        if(dateId.length > 7) {
            let chosenDay = dateId.slice(8,10);
            today.setDate(chosenDay);
        }
    }
    let randomValue = "Transaction#" + today.toISOString();
    let currentDate = today.getFullYear() + '-' + ("0" + (Number(today.getMonth()) + 1)).slice(-2);
    let dateObj = await getDateData(walletId, currentDate);
    
    // If Date is not empty
    if(isNotEmpty(dateObj)) {
        dateId = dateObj[0].sk.S;
    } else {
        dateId = "Date#" + today.toISOString();
        dateObj = await createDateData(walletId, dateId);
    }
    
    let defaultAccount = await getDefaultAccount(walletId);
    if(isEmpty(defaultAccount)) {
       console.log("The default account is not present");
       return DEFAULT_ACCOUNT_NOTPRESENT;
    }

    var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": {
                S: walletId
            },
            "sk": {
                S: randomValue
            },
            "amount": {
                N: amount
            },
            "category": {
                S: categoryId
            },
            "recurrence": {
                S: 'NEVER'
            },
            "account": {
                S: defaultAccount.sk.S
            },
            "date_meant_for": {
                S: dateId
            },
            "creation_date": {
                S: today.toISOString()
            },
            "updated_date": {
                S: today.toISOString()
            }
        }
    };

    console.log("Adding a new item...");
    return dbHelper.addToBlitzBudgetTable(params).then((data) => {
        console.log('Successfully added the transaction to the DynamoDB.');
        return ADDED_NEW_TRANSACTION + amount + ' ' + currencyName;
      })
      .catch((err) => {
        console.log("There was an error adding a new transaction from DynamoDB ", err);
        return ERROR_ADDING_TRANSACTION;
      })
}

blitzbudgetDB.prototype.getEarningsByDateFromAlexa = async function(walletId, dateId, walletCurrency) {
    
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "Transaction#" + dateId
                }
            },
            ProjectionExpression: "amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags"
        }
    console.log("The params to fetch the earnings are ", params);

    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the transaction information from the DynamoDB. Item count is ' + data.length);
        let transactionBalance = 0;
        // If length is not empty
        if(isNotEmpty(data)) {
            for(let i=0, len=data.length; i<len; i++) {
                let item = data[i];
                let transactionAmount = Number(item.amount.N);
                if(transactionAmount > 0) {
                    transactionBalance += transactionAmount;   
                }
            }
        }
        return YOU_EARNED + transactionBalance + ' ' + walletCurrency;
    })
      .catch((err) => {
          console.log("There was an error fetching the earnings ", err);
        return ERROR_EARNED;
      })
    
}

blitzbudgetDB.prototype.getExpenditureByDateFromAlexa = async function(walletId, dateId, walletCurrency) {
    
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "Transaction#" + dateId
                }
            },
            ProjectionExpression: "amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags"
        }
    console.log("The params to fetch the expense is ", params);
        
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the transaction information from the DynamoDB. Item count is ' + data.length);
        let transactionBalance = 0;
        // If length is not empty
        if(isNotEmpty(data)) {
            for(let i=0, len=data.length; i<len; i++) {
                let item = data[i];
                let transactionAmount = Number(item.amount.N);
                if(transactionAmount < 0) {
                    transactionBalance += transactionAmount;   
                }
            }
        }
        return SUCCESS_SPENT + transactionBalance + ' ' + walletCurrency;
    })
      .catch((err) => {
          console.log("There was an error fetching your expenditure ", err);
        return ERROR_EXPENDITURE;
      })
    
}

blitzbudgetDB.prototype.getTransactionTotalByDateFromAlexa = async function(walletId, dateId, walletCurrency) {
    
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "Transaction#" + dateId
                }
            },
            ProjectionExpression: "amount, description, category, recurrence, account, date_meant_for, sk, pk, creation_date, tags"
        }
    
    console.log("The params to fetch the transaction total are ", params);
        
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the transaction information from the DynamoDB. Item count is ' + data.length);
        let transactionBalance = 0;
        // If length is not empty
        if(isNotEmpty(data)) {
            for(let i=0, len=data.length; i<len; i++) {
                let item = data[i];
                let transactionAmount = Number(item.amount.N);
                transactionBalance += transactionAmount;   
            }
        }
        return SUCCESS_TRANSACTION_TOTAL + transactionBalance + ' ' + walletCurrency;
    })
      .catch((err) => {
          console.log("There was an error fetching the tag balance ", err);
        return ERROR_TRANSACTION_TOTAL;
      })
    
}

blitzbudgetDB.prototype.addCategoryByDateFromAlexa = async function(walletId, currentDate, categoryName, categoryType) {
    let today = new Date();
    
    if(isNotEmpty(currentDate)) {
        let chosenYear = currentDate.slice(0,4);
        today.setFullYear(chosenYear);
        
        // If month is present
        if(currentDate.length > 4) {
            let chosenMonth = currentDate.slice(5,7);
            // Javascript month is 0 -11 while alexa is 0-12
            chosenMonth = Number(chosenMonth) - 1;
            today.setMonth(chosenMonth);
        }
        
        // If date is present then
        if(currentDate.length > 7) {
            let chosenDay = currentDate.slice(8,10);
            today.setDate(chosenDay);
        }
    }
    let randomValue = "Category#" + today.toISOString(); 
    
    if(isNotEmpty(categoryName)) {
        if(categoryName.length > 1) {
            categoryName = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
        } else {
            categoryName = categoryName.charAt(0).toUpperCase();
        }
    }
    
     var params = {
        TableName: 'blitzbudget',
        Item: {
            "pk": {
                S: walletId
            },
            "sk": {
                S: randomValue
            },
            "category_name": {
                S: categoryName
            },
            "category_total": {
                N: "0"
            },
            "category_type": {
                S: categoryType
            }
        }
     }
    
    console.log("Adding a new item with param... ", params);
    return dbHelper.addToBlitzBudgetTable(params).then((data) => {
        console.log('Successfully added the category to the DynamoDB.');
        return ADDED_NEW_CATEGORY + categoryName;
      })
      .catch((err) => {
        console.log("There was an error adding a new category from DynamoDB ", err);
        return ERROR_ADDING_CATEGORY;
      })
    
}

/*
* Handle Helper Functions
*/

async function getDefaultAccount(walletId) {
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "BankAccount#"
                }
            },
            ProjectionExpression: "bank_account_name, linked, bank_account_number, account_balance, sk, pk, selected_account, number_of_times_selected, account_type"
        }
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the account information from the DynamoDB. Item count is ' + data.length);
        let defaultAccount = data[0];
        // If length is empty
        if(isEmpty(data)) {
            return;
        } else {
            for(let i=0, len=data.length; i<len; i++) {
                let ba = data[i];
                if(ba['selected_account']) {
                    defaultAccount = ba;
                }
            }
        }
        return defaultAccount;
      })
      .catch((err) => {
        console.log(`There were issues getting your account from Blitz Budget. Please try again.`, err);
        return;
      })
}

async function createDateData(walletId, skForDate) {
    
    var params = {
        TableName: 'blitzbudget',
        Key: {
            "pk": walletId,
            "sk": skForDate,
        },
        UpdateExpression: "set income_total = :r, expense_total=:p, balance=:a, creation_date = :c, updated_date = :u",
        ExpressionAttributeValues: {
            ":r": 0,
            ":p": 0,
            ":a": 0,
            ":c": new Date().toISOString(),
            ":u": new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
    }

    return dbHelper.addToBlitzBudgetTable(params).then((data) => {
        console.log('Successfully created the date to the DynamoDB. Item count is ' + data.length);
        return data;
        
      })
      .catch((err) => {
        console.log(" There was an error creating the date object", err);
        return;
      })

}

async function getDateData(walletId, currentDate) {
    const params = {
            TableName: TABLE_NAME,
            KeyConditionExpression: "pk = :pk and begins_with(sk, :items)",
            ExpressionAttributeValues: {
                ":pk": {
                  S: walletId
                },
                ":items": {
                  S: "Date#" + currentDate
                }
            },
            ProjectionExpression: "pk, sk"
        }
    return dbHelper.getFromBlitzBudgetTable(params).then((data) => {
        console.log('Successfully retrieved the date information from the DynamoDB. Item count is ' + data.length);
        return data;
        
      })
      .catch((err) => {
        console.log("There was an error fetching the date information ", err);
        return;
      })
    
}

async function patchAccount(walletId, accountId, selectedAccount) {
    var params = {
        TableName: TABLE_NAME,
        Key: {
            "pk":  {
                S: walletId
            },
            "sk": {
                S: accountId
            }
        },
        UpdateExpression: 'set #variable1 = :v1, #update = :u',
        ExpressionAttributeNames: {
            "#variable1": "selected_account",
            "#update": "updated_date"
        },
        ExpressionAttributeValues: {
            ":v1": {
                BOOL: selectedAccount
            },
            ":u": {
                S: new Date().toISOString()
            }
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the account with a default alexa property ", JSON.stringify(params));
                
    return dbHelper.patchFromBlitzBudgetTable(params);
}

async function patchWallet(userId, walletId, defaultAlexa) {
                
    var params = {
        TableName: TABLE_NAME,
        Key: {
            "pk":  {
                S: userId
            },
            "sk": {
                S: walletId
            }
        },
        UpdateExpression: 'set #variable1 = :v1, #update = :u',
        ExpressionAttributeNames: {
            "#variable1": "default_alexa",
            "#update": "updated_date"
        },
        ExpressionAttributeValues: {
            ":v1": {
                BOOL: defaultAlexa
            },
            ":u": {
                S: new Date().toISOString()
            }
        },
        ReturnValues:"UPDATED_NEW"
    };
    
    console.log("Updating the wallet with a default alexa property ", JSON.stringify(params));
                
    return dbHelper.patchFromBlitzBudgetTable(params);
}

// Is Empty Check
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

// Export object
module.exports = new blitzbudgetDB();