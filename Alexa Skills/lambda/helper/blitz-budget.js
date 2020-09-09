var blitzbudgetDB = function () { };


const dbHelper = require('./dbHelper');
const TABLE_NAME = "blitzbudget";


/*
* Fetch all default wallets
*/
blitzbudgetDB.prototype.getDefaultAlexaWallet = async function(userId, responseBuilder) {
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
                if(item['default_alexa']) {
                    wallet = item;
                }
            }   
        }
        return wallet;
      })
      .catch((err) => {
        const speechText = `There were issues getting your wallet from Blitz Budget. Please try again.`
        return responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      })
}

/*
* Fetch all default accounts
*/
blitzbudgetDB.prototype.getDefaultAlexaAccount = async function(walletId, responseBuilder) {
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
        if(typeof (data.length) == 'undefined' || data.length == 0) {
            // TODO
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
        const speechText = `There were issues getting your account from Blitz Budget. Please try again.`
        return responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      })
}

/*
* Fetch all category
*/
blitzbudgetDB.prototype.getCategoryAlexa = async function(walletId, categoryName, date, responseBuilder) {
    console.log('The Category name is ', categoryName, ' and the date is ', date);
    let selectedDate;
    if(isEmpty(date)) {
        let currentDate =  new Date();
        selectedDate = currentDate.getFullYear() + '-' + ("0" + currentDate.getMonth()).slice(-2);
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
        const speechText = `There were issues getting your category from Blitz Budget. Please try again.`
        return responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      })
}

/*
* Fetch all budget
*/
blitzbudgetDB.prototype.getBudgetAlexaAmount = async function(walletId, categoryId, selectedDate, responseBuilder) {
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
        const speechText = `There were issues getting your budget from Blitz Budget. Please try again.`
        return responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      })
}

blitzbudgetDB.prototype.getTagAlexaBalance = async function(walletId, tagName, selectedDate, responseBuilder) {
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
        console.log("The tag has a balance of ", tagBal);
        return tagBal;
      })
      .catch((err) => {
        const speechText = `There were issues getting your transaction from Blitz Budget. Please try again.`
        return responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      })
}

blitzbudgetDB.prototype.getWalletFromAlexa = async function(userId, responseBuilder) {
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
        const speechText = `There were issues getting your account from Blitz Budget. Please try again.`
        return responseBuilder
          .speak(speechText)
          .reprompt(speechText)
          .getResponse();
      })
}

blitzbudgetDB.prototype.changeDefaultWalletAlexa = async function(userId, data, currencyName) {
    let events = [], say;
    // If length is empty
    if(isNotEmpty(data)) {
        for(let i=0, len=data.length; i<len; i++) {
            let item = data[i];
            if(item['default_alexa']) {
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
        say = 'The requested wallet is not present. Do you want me to create them for you?'
    } else {
        /*
        * Patch Wallet
        */
        await Promise.all(events).then(function (result) {
            console.log("Successfully updated the wallet information");
            say = 'Successfully updated the default wallet to ' + currencyName;
        }, function (err) {
            throw new Error("Unable error occured while fetching the Wallet " + err);
            say = 'Oops! there was an error changing the default wallet. Please try again later!'
        });   
    }
    
    return say;
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