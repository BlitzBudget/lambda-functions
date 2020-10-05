// Lambda Function code for Alexa.
// Paste this into your index.js file. 
// alexa.design/codegenerator

// Setup ================================================================================

const https = require("https");
const AWS = require('aws-sdk');
const Alexa = require("ask-sdk-core");
const blitzbudgetDB = require('./helper/blitz-budget');
const featureRequest = require('./helper/feature-request');

// Constants ============================================================================

// TODO: clean up debugging code
// const DEBUG = getEnvVar('DEBUG', false); // true = log to CloudWatch Logs ; false = no logging
const invocationName = "blitz budget";
const OPTED_OUT_VOICE_CODE = 'OPTED_OUT_VOICE_CODE';
const COGNITO_REGION = getEnvVar('COGNITO_REGION', 'eu-west-1');

const THE_MESSAGE = ' The ';
const YOUR_MESSAGE = ' Your ';
const HELLO_MESSAGE = 'Hello ';
const SKILL_NAME =  'Blitz Budget';
const BUDGET_BALANCE_ONE = ' budget has ';
const BUDGET_BALANCE_TWO = " remaining";
const TAG_MESSAGE = ' tag has a balance of ';
const BUDGET_RETRIEVED = ' budget amount is ';
const DEFAULT_WALLET = 'Your default wallet is ';
const DEFAULT_ACCOUNT_SUCCESS = 'Your default account is ';
const GREETING_MESSAGE =  '. <amazon:emotion name="excited" intensity="low"> What can I do for you today?  </amazon:emotion>';
const CATEGORY_BALANCE_ERROR_TWO = ' category has a balance of ';
const GOODBYE_MESSAGE = 'Good bye. It was nice talking to you. ';
const GOAL_TYPE_ERROR = 'I didn\'t get the goal type. Please try again!';
const ERR_MESSAGE =  '<amazon:emotion name="disappointed" intensity="medium"> Sorry, I can\'t understand that request. Please try again! </amazon:emotion>';
const EMPTY_AMOUNT  = '<amazon:emotion name="disappointed" intensity="medium"> I didn\'t get the amount entered for the transaction. Please try again! </amazon:emotion>';
const CURRENCY_NOTFOUND = '<amazon:emotion name="disappointed" intensity="medium"> I couldn\'t find the currency that you mentioned. Please try again! </amazon:emotion>';
const EMPTY_TAG = ' tag is not present in any of the transactions. Please try again!';
const EMPTY_CATEGORY = 'I didn\'t get the category entered for the transaction. Please try again!';
const EMPTY_WALLET = '<amazon:emotion name="disappointed" intensity="medium"> The requested currency cannot be found. </amazon:emotion> Consider creating a wallet by saying <break time="0.20s"/> "Create a new wallet for" followed by the currency name as you find it in the blitz budget application. ';
const HELP_MESSAGE = 'You can say: \'alexa, hello\', \'alexa, tell me my info\' or \'alexa, who am I\'.';
const CATEGORY_EMPTY = ' category has not been created. Consider creating a new category by saying <break time="0.20s"/> "Create a new category for "';
const EMPTY_ACCOUNT = '<amazon:emotion name="disappointed" intensity="medium"> Sorry, There was an error while getting you default account. </amazon:emotion> Please try again!';
const BUDGET_NOT_CREATED = ' budget has not been created. Consider creating a budget for ';
const BUDGET_NOT_CREATED_TWO = ' by saying <break time="0.20s"/> "Add a new budget for "';
const BUDGET_CREATED_ERROR = ' budget has already been created.';
const BUDGET_EMPTY_ERROR = ' budget is not created. Consider creating a new budget by saying <break time="0.20s"/> "Create a new budget for "';
const NEED_TO_LINK_MESSAGE = 'Before we can continue, you will need to link your account to the skill using the card that I have sent to the Alexa app.';
const CATEGORY_EXISTS = '<amazon:emotion name="disappointed" intensity="medium"> The selected category is already present for the mentioned dates. </amazon:emotion> Consider creating a new category by saying <break time="0.20s"/> "Create a new category for "';
const EMPTY_CATEGORY_TYPE = 'The category type cannot be empty. Please try again!';
const INCOME_CATEGORY_ERROR = 'Sorry! it is not possible to create a budget for an income category. Please try again!';
const GET_WALLET_BALANCE = "Your wallet balance is ";
const WALLET_IS_NOT_PRESENT = 'The wallet that you mentioned is not present. Consider adding a wallet by saying <break time="0.20s"/> "Add a new wallet for" ';
const LOST_VOICE_CODE = 'Sorry to hear that! You could disable the blitzbudget skill in Alexa and then re-enable it again.';
const VERIFY_VOICE_CODE = '<amazon:emotion name="disappointed" intensity="medium"> You need to verify your voice code. </amazon:emotion> Verify by saying <break time="0.20s"/> "Verify Blitz Budget " followed by your four digit voice code';
const SESSION_VERIFIED = '<amazon:emotion name="excited" intensity="low">Great! You session has been successfully verified. </amazon:emotion> How can I help you today?';


const SUCCESSFUL_TITLE = 'Successfully';
const CARD_SECURITY_TITLE = "BlitzBudget Security Information";
const ADDED_NEW_TRANSACTION_SIMPLE_CARD = "A new transaction was added through Alexa.";
const CHANGED_DEFAULT_WALLET_SIMPLE_CARD = "The default wallet for Alexa has been changed.";
const CHANGED_DEFAULT_ACCOUNT_SIMPLE_CARD = "The default account for Alexa has been changed.";
const ADDED_NEW_CATEGORY_SIMPLE_CARD = "A new category has been added through Alexa.";
const ADDED_NEW_WALLET_SIMPLE_CARD = "A new wallet has been added through Alexa.";
const CHANGED_BUDGET_AMOUNT_SIMPLE_CARD = "A budget's amount has been changed through Alexa.";
const ADDED_NEW_GOAL_SIMPLE_CARD = "A new goal has been added through Alexa.";
const ADDED_NEW_BUDGET_SIMPLE_CARD = "A new budget has been added through Alexa.";


// 1. Intent Handlers =============================================

// CheckAccountLinkedHandler: This handler is always run first,
// based on the order defined in the skillBuilder.
// If no access token is present, then send the Link Account Card.
//``
const CheckAccountLinkedHandler = {
  canHandle(handlerInput) {
    // If accessToken does not exist (ie, account is not linked),
    // then return true, which triggers the "need to link" card.
    // This should not be used unless the skill cannot function without
    // a linked account.  If there's some functionality which is available without
    // linking an account, do this check "just-in-time"
    return triggerNeedToLinkAccounted(handlerInput);
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = NEED_TO_LINK_MESSAGE;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withLinkAccountCard()
      .getResponse();
  },
};

// CheckVoiceCodeVerifiedHandler: This handler is always run second,
// based on the order defined in the skillBuilder.
// If verification code is not set, then request it from the user.
//``
const CheckVoiceCodeVerifiedHandler = {
  canHandle(handlerInput) {
    // If voice code is required, 
    // then return true
    return checkIfVoiceCodeRequired(handlerInput);
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = VERIFY_VOICE_CODE;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

const AMAZON_CancelIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.CancelIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();


        let say = 'Okay, talk to you later! ';

        return responseBuilder
            .speak(say)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const AMAZON_HelpIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let history = sessionAttributes['history'];
        let intents = getCustomIntents();
        let sampleIntent = randomElement(intents);

        let say = ''; 

        say += ' Here is something you can ask me, ' + getSampleUtterance(sampleIntent);

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const AMAZON_StopIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.StopIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();


        let say = 'Okay, talk to you later! ';

        return responseBuilder
            .speak(say)
            .withShouldEndSession(true)
            .getResponse();
    },
};

const AMAZON_NavigateHomeIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.NavigateHomeIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let say = 'Hello from AMAZON.NavigateHomeIntent. ';


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const AMAZON_FallbackIntent_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.FallbackIntent' ;
    },
    handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let previousSpeech = getPreviousSpeechOutput(sessionAttributes);

        return responseBuilder
            .speak('Sorry I didnt catch what you said, ' + stripSpeak(previousSpeech.outputSpeech))
            .reprompt(stripSpeak(previousSpeech.reprompt))
            .getResponse();
    },
};

const getWalletBalance_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getWalletBalance' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('The User id retrieved is ', sessionAttributes.userId);

        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        
        if (slotValues.wallet.heardAs && slotValues.wallet.heardAs !== '') {
            let walletCurrency;
            if (slotValues.wallet.ERstatus === 'ER_SUCCESS_MATCH') {
                if(slotValues.wallet.resolved !== slotValues.wallet.heardAs) {
                    walletCurrency = slotValues.wallet.resolved; 
                } else {
                    walletCurrency = slotValues.wallet.heardAs;
                } 
            }
            
            if (slotValues.wallet.ERstatus === 'ER_SUCCESS_NO_MATCH') {
                console.log('***** consider adding "' + slotValues.wallet.heardAs + '" to the custom slot type used by slot wallet! '); 
                slotStatus += ERR_MESSAGE;
                shouldEndSession = false;
            } else {
                console.log("The wallet currency to change is ", walletCurrency);
                let allWallets = await blitzbudgetDB.getWalletFromAlexa(sessionAttributes.userId);
                let wallet = blitzbudgetDB.getMatchingWalletAlexa(allWallets, walletCurrency);
                // Successfully Changed the default wallet then
                if(isNotEmpty(wallet)) {
                    slotStatus += GET_WALLET_BALANCE + wallet['wallet_balance'].N + ' ' + walletCurrency;
                    // Send a simple card to Alexa on Success
                    responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, CHANGED_DEFAULT_WALLET_SIMPLE_CARD);   
                } else {
                    slotStatus = WALLET_IS_NOT_PRESENT + walletCurrency;
                }
                
                
                
            }
        } else {
            let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
            console.log('The wallets obtained are ', JSON.stringify(wallet));
            
            // Successfully Changed the default wallet then
            if(isNotEmpty(wallet)) {
                slotStatus += GET_WALLET_BALANCE + wallet['wallet_balance'].N + ' ' + wallet['currency'].S;
                // Send a simple card to Alexa on Success
                responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, CHANGED_DEFAULT_WALLET_SIMPLE_CARD);   
            } else {
                slotStatus = WALLET_IS_NOT_PRESENT + wallet['currency'].S;
            }
        }
        
        
        say += slotStatus;

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const getRecentTransactions_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getRecentTransactions' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('The User id retrieved is ', sessionAttributes.userId);
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        console.log('The wallets obtained are ', JSON.stringify(wallet));
        console.log("Calculating recent transactions for the wallet " + wallet.sk.S);
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        slotStatus = await blitzbudgetDB.getRecentTransactions(wallet.sk.S, '2020-09', wallet.currency.S);
        
        say += slotStatus;

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const getCategoryBalance_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getCategoryBalance' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('The User id retrieved is ', sessionAttributes.userId);
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        console.log('The wallets obtained are ', JSON.stringify(wallet));
        let say = '';

        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: category 
        if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
            let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, slotValues.date.heardAs);
            if(isEmpty(category)) {
                slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY + slotValues.category.heardAs;
                shouldEndSession = false;
            } else {
                slotStatus += YOUR_MESSAGE + slotValues.category.heardAs + CATEGORY_BALANCE_ERROR_TWO + category['category_total'].N + ' ' + wallet.currency.S;   
            }
        } else {
            slotStatus += ERR_MESSAGE;
            shouldEndSession = false;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};


const addNewTransaction_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'addNewTransaction' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let say = '';

        let slotStatus = '';
        let wallet, shouldEndSession = true;
        
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: goaltype 
        let slotValues = getSlotValues(request.intent.slots); 
        if(isNotEmpty(slotValues.currency.heardAs)) {
            let allWallets = await blitzbudgetDB.getWalletFromAlexa(sessionAttributes.userId);
            wallet = blitzbudgetDB.calculateWalletFromAlexa(allWallets, slotValues); 
            console.log("The calculate wallet is ", JSON.stringify(wallet), ". The currency name is ", slotValues.currency.heardAs);
        } else {
            wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
            console.log("The default wallet is ", wallet.currency.S, " Heard as ", slotValues.currency.heardAs);
        }
        
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: category 
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
            shouldEndSession = false;
        } else {
            console.log("The number of transaction is ",slotValues.number, " The category is ", slotValues.category);
            if(isEmpty(slotValues.number.heardAs)) {
                slotStatus = EMPTY_AMOUNT;
            } else {
                // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
                // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
                //   SLOT: category 
                if (slotValues.categories.heardAs && slotValues.categories.heardAs !== '') {
                    let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.categories.heardAs, slotValues.date.heardAs);
                    if(isEmpty(category)) {
                        slotStatus = THE_MESSAGE + slotValues.categories.heardAs + CATEGORY_EMPTY + slotValues.categories.heardAs;
                        shouldEndSession = false;
                    } else {
                        // If the category type is expense then
                        let categoryType = category['category_type'].S;
                        let transactionTotal = Number(slotValues.number.heardAs);
                        switch(categoryType) {
                            case 'Expense':
                                transactionTotal *= -1;
                                break;
                        }
                        slotStatus = await blitzbudgetDB.addTransactionAlexaAmount(wallet.sk.S, category.sk.S, transactionTotal.toString(), slotValues.date.heardAs, wallet.currency.S);
                        // Successfully Added the transaction then
                        if(includesStr(slotStatus, SUCCESSFUL_TITLE)) {
                            // Send a simple card to Alexa on Success
                            responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, ADDED_NEW_TRANSACTION_SIMPLE_CARD);   
                        }
                    }
                } else {
                    slotStatus = EMPTY_CATEGORY;
                    shouldEndSession = false;
                }
                
            }
        } 

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const changeDefaultWallet_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'changeDefaultWallet' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: wallet 
        if (slotValues.wallet.heardAs && slotValues.wallet.heardAs !== '') {
            let walletCurrency;
            if (slotValues.wallet.ERstatus === 'ER_SUCCESS_MATCH') {
                if(slotValues.wallet.resolved !== slotValues.wallet.heardAs) {
                    walletCurrency = slotValues.wallet.resolved; 
                } else {
                    walletCurrency = slotValues.wallet.heardAs;
                } 
            }
            
            if (slotValues.wallet.ERstatus === 'ER_SUCCESS_NO_MATCH') {
                console.log('***** consider adding "' + slotValues.wallet.heardAs + '" to the custom slot type used by slot wallet! '); 
                slotStatus += ERR_MESSAGE;
                shouldEndSession = false;
            } else {
                console.log("The wallet currency to change is ", walletCurrency);
                let allWallets = await blitzbudgetDB.getWalletFromAlexa(sessionAttributes.userId);
                let changeWallet = await blitzbudgetDB.changeDefaultWalletAlexa(sessionAttributes.userId, allWallets, walletCurrency);
                slotStatus += changeWallet;
                // Successfully Changed the default wallet then
                if(includesStr(slotStatus, SUCCESSFUL_TITLE)) {
                    // Send a simple card to Alexa on Success
                    responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, CHANGED_DEFAULT_WALLET_SIMPLE_CARD);   
                }
            }
        } else {
            slotStatus += ERR_MESSAGE;
            shouldEndSession = false;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const changeDefaultAccount_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'changeDefaultAccount' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        console.log('The wallets obtained are ', JSON.stringify(wallet));
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: account 
        if (slotValues.account.heardAs && slotValues.account.heardAs !== '') {
            let allAccounts = await blitzbudgetDB.getAccountFromAlexa(wallet.sk.S);
            let changeAccount = await blitzbudgetDB.changeDefaultAccountAlexa(allAccounts, slotValues.account.heardAs);
            slotStatus = changeAccount;
            // Successfully Changed the default wallet then
            if(includesStr(slotStatus, SUCCESSFUL_TITLE)) {
                // Send a simple card to Alexa on Success
                responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, CHANGED_DEFAULT_ACCOUNT_SIMPLE_CARD);   
            }
        } else {
            slotStatus = ERR_MESSAGE;
            shouldEndSession = false;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const addNewBudget_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'addNewBudget' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let shouldEndSession = true;

        let say = '';
        let slotStatus = '';
        let wallet;

        let slotValues = getSlotValues(request.intent.slots); 
        if(isNotEmpty(slotValues.currency.heardAs)) {
            let allWallets = await blitzbudgetDB.getWalletFromAlexa(sessionAttributes.userId);
            wallet = blitzbudgetDB.calculateWalletFromAlexa(allWallets, slotValues); 
            console.log("The calculate wallet is ", JSON.stringify(wallet), ". The currency name is ", slotValues.currency.heardAs);
        } else {
            wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
            console.log("The default wallet is ", wallet.currency.S);
        }
        
        let currentDate =  new Date();
        currentDate = currentDate.getFullYear() + '-' + ("0" + (Number(currentDate.getMonth()) + 1)).slice(-2);
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: category 
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
            shouldEndSession = false;
        } else {
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            //   SLOT: category 
            if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
                let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, currentDate);
                if(isEmpty(category)) {
                    slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY + slotValues.category.heardAs;
                    shouldEndSession = false;
                } else if(isEqual(category['category_type'].S, 'Income')) {
                    slotStatus = INCOME_CATEGORY_ERROR;
                    shouldEndSession = false;
                } else {
                    let budget = await blitzbudgetDB.getBudgetAlexaAmount(wallet.sk.S, category.sk.S, currentDate);
                    if(isEmpty(budget)) {
                        slotStatus += await blitzbudgetDB.addBudgetAlexaAmount(wallet.sk.S, category.sk.S, slotValues.amount.heardAs, currentDate, slotValues.category.heardAs);
                        // Successfully added a new budget then
                        if(includesStr(slotStatus, SUCCESSFUL_TITLE)) {
                            // Send a simple card to Alexa on Success
                            responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, ADDED_NEW_BUDGET_SIMPLE_CARD);   
                        }
                    } else {
                        slotStatus += THE_MESSAGE + slotValues.category.heardAs + BUDGET_CREATED_ERROR;
                    }
                }
            } else {
                slotStatus += ERR_MESSAGE;
                shouldEndSession = false;
            }
            
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const addNewGoal_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'addNewGoal' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let shouldEndSession = true;
        let say = '';
        let slotStatus = '';
        let wallet;
  
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: goaltype 
        let slotValues = getSlotValues(request.intent.slots); 
        if(isNotEmpty(slotValues.currency.heardAs)) {
            let allWallets = await blitzbudgetDB.getWalletFromAlexa(sessionAttributes.userId);
            wallet = blitzbudgetDB.calculateWalletFromAlexa(allWallets, slotValues); 
            console.log("The calculate wallet is ", JSON.stringify(wallet), ". The currency name is ", slotValues.currency.heardAs);
        } else {
            wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
            console.log("The default wallet is ", wallet.currency.S);
        }
        
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: category 
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
            shouldEndSession = false;
        } else {
            let goalType = isEmpty(slotValues.goaltype.id) ? slotValues.goaltype.heardAs : slotValues.goaltype.id;
            if(isEmpty(slotValues.goaltype.heardAs) && isEmpty(slotValues.goaltype.id)) {
                slotStatus = GOAL_TYPE_ERROR;
                shouldEndSession = false;
            } else {
                slotStatus = await blitzbudgetDB.addNewGoalFromAlexa(wallet.sk.S, slotValues.amount.heardAs, goalType, slotValues.monthlyContribution.heardAs, slotValues.targetDate.heardAs);
                // Successfully added a new goal then
                if(includesStr(slotStatus, SUCCESSFUL_TITLE)) {
                    // Send a simple card to Alexa on Success
                    responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, ADDED_NEW_GOAL_SIMPLE_CARD);   
                }
            }
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const getBudgetAmount_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getBudgetAmount' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        let say = '';

        let slotStatus = '';
        
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        
        // Date
        let currentDate =  new Date();
        // Date used to get the budget
        if(isNotEmpty(slotValues.date.heardAs)) {
            let dateMentioned = slotValues.date.heardAs;
            console.log("The Date mentioned is ", dateMentioned);
            if(dateMentioned.length < 6) {
                // For example is 2019 then become 2019-09
                dateMentioned = dateMentioned + '-' + (currentDate.getMonth() + 1);
            }
            currentDate =  new Date(dateMentioned);
        }
        currentDate = currentDate.getFullYear() + '-' + ("0" + (Number(currentDate.getMonth()) + 1)).slice(-2);
        
        //   SLOT: category 
        if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
            let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, currentDate);
            if(isEmpty(category)) {
                slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY + slotValues.category.heardAs;
                shouldEndSession = false;
            } else {
                let budget = await blitzbudgetDB.getBudgetAlexaAmount(wallet.sk.S, category.sk.S, currentDate);
                if(isEmpty(budget)) {
                    slotStatus += THE_MESSAGE + slotValues.category.heardAs + BUDGET_EMPTY_ERROR + slotValues.category.heardAs;
                    shouldEndSession = false;
                } else {
                    slotStatus += YOUR_MESSAGE + slotValues.category.heardAs + BUDGET_RETRIEVED + budget['planned'].N + ' ' + wallet.currency.S;
                }
            }
        } else {
            slotStatus += ERR_MESSAGE;
            shouldEndSession = false;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
}

const getBudgetBalance_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getBudgetBalance' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        let shouldEndSession = true;
        
        let say = '';
        let slotStatus = '';
        
        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        
        // Date
        let currentDate =  new Date();
        currentDate = currentDate.getFullYear() + '-' + ("0" + (Number(currentDate.getMonth()) + 1)).slice(-2);
        
        //   SLOT: category 
        if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
            let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, currentDate);
            if(isEmpty(category)) {
                slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY + slotValues.category.heardAs;
                shouldEndSession = false;
            } else {
                let budget = await blitzbudgetDB.getBudgetAlexaAmount(wallet.sk.S, category.sk.S, currentDate);
                if(isEmpty(budget)) {
                    slotStatus += THE_MESSAGE + slotValues.category.heardAs + BUDGET_NOT_CREATED + category['category_name'].S + BUDGET_NOT_CREATED_TWO + category['category_name'].S ;
                    shouldEndSession = false;
                } else {
                    let budgetBalance = Number(budget['planned'].N) + Number(category['category_total'].N);
                    slotStatus += YOUR_MESSAGE + slotValues.category.heardAs + BUDGET_BALANCE_ONE + budgetBalance + ' ' + wallet.currency.S + BUDGET_BALANCE_TWO;   
                }
            }
        } else {
            slotStatus += ERR_MESSAGE;
            shouldEndSession = false;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const getTagBalance_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getTagBalance' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        
        // Date
        let currentDate =  new Date();
        currentDate = currentDate.getFullYear() + '-' + ("0" + (Number(currentDate.getMonth()) + 1)).slice(-2);
        
        //   SLOT: tag 
        if (slotValues.tag.heardAs && slotValues.tag.heardAs !== '') {
            let tagBalance = await blitzbudgetDB.getTagAlexaBalance(wallet.sk.S, slotValues.tag.heardAs, currentDate);
            if(isEmpty(tagBalance)) {
                slotStatus += THE_MESSAGE + slotValues.tag.heardAs + EMPTY_TAG;
                shouldEndSession = false;
            } else {
                slotStatus += YOUR_MESSAGE + slotValues.tag.heardAs + TAG_MESSAGE + tagBalance + ' ' + wallet.currency.S;   
            }
            console.log("The", slotValues.tag.heardAs, " tag has a balance of ", tagBalance);
        } else {
            slotStatus += ERR_MESSAGE;
            shouldEndSession = false;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const changeBudgetAmount_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'changeBudgetAmount' ;
    },
    async handle(handlerInput) {
        let wallet, shouldEndSession = true;
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log("The Budget amount is ", JSON.stringify(request.intent.slots));
        let slotValues = getSlotValues(request.intent.slots); 
        if(isNotEmpty(slotValues.currency.heardAs)) {
            let allWallets = await blitzbudgetDB.getWalletFromAlexa(sessionAttributes.userId);
            wallet = blitzbudgetDB.calculateWalletFromAlexa(allWallets, slotValues); 
            console.log("The calculate wallet is ", JSON.stringify(wallet), ". The currency name is ", slotValues.currency.heardAs);
        } else {
            wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
            console.log("The default wallet is ", wallet.currency.S);
        }
        
        let say = '';
        let slotStatus = '';
        
        
        let currentDate =  new Date();
        currentDate = currentDate.getFullYear() + '-' + ("0" + (Number(currentDate.getMonth()) + 1)).slice(-2);
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
            shouldEndSession = false;
        } else {
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            //   SLOT: category 
            if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
                let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, currentDate);
                if(isEmpty(category)) {
                    slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY + slotValues.category.heardAs;
                    shouldEndSession = false;
                } else {
                    let budget = await blitzbudgetDB.getBudgetAlexaAmount(wallet.sk.S, category.sk.S, currentDate);
                    if(isEmpty(budget)) {
                        slotStatus += THE_MESSAGE + slotValues.category.heardAs + BUDGET_NOT_CREATED + category['category_name'].S + BUDGET_NOT_CREATED_TWO + category['category_name'].S;
                        shouldEndSession = false;
                    } else {
                        slotStatus += await blitzbudgetDB.changeBudgetAlexaAmount(wallet.sk.S, budget.sk.S, slotValues.amt.heardAs, wallet.currency.S);
                        // Successfully change budget amount then
                        if(includesStr(slotStatus, SUCCESSFUL_TITLE)) {
                            // Send a simple card to Alexa on Success
                            responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, CHANGED_BUDGET_AMOUNT_SIMPLE_CARD);   
                        }
                    }
                }
            } else {
                slotStatus += ERR_MESSAGE;
                shouldEndSession = false;
            }
            
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const getDefaultWallet_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getDefaultWallet' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        let say = DEFAULT_WALLET + wallet.currency.S;

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(true) // End session for security purposes
            .getResponse();
    },
};

const getDefaultAccount_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getDefaultAccount' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        console.log('The wallets obtained are ', JSON.stringify(wallet));
        let say, shouldEndSession = true;
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
            shouldEndSession = false;
        } else {
            let defaultAccount = await blitzbudgetDB.getDefaultAlexaAccount(wallet.sk.S);

            if(isEmpty(defaultAccount)) {
                say = EMPTY_ACCOUNT;
                shouldEndSession = false;
            } else {
                say = DEFAULT_ACCOUNT_SUCCESS + defaultAccount['bank_account_name'].S;
            }
        }

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const addNewWallet_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'addNewWallet' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: currency 
        if (slotValues.currency.heardAs && slotValues.currency.heardAs !== '') {
            let matchedCurrency = blitzbudgetDB.checkIfWalletIsInvalid(slotValues);
            if(isEmpty(matchedCurrency)) {
               slotStatus = CURRENCY_NOTFOUND;
               shouldEndSession = false;
            } else {
                slotStatus = await blitzbudgetDB.addWalletFromAlexa(sessionAttributes.userId, matchedCurrency);
                // Successfully change budget amount then
                if(includesStr(slotStatus, SUCCESSFUL_TITLE)) {
                    // Send a simple card to Alexa on Success
                    responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, ADDED_NEW_WALLET_SIMPLE_CARD);   
                }
            }
        } else {
            slotStatus += ERR_MESSAGE;
            shouldEndSession = false;
        }
        
        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const sendFeatureRequest_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'sendFeatureRequest' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        let say = '';

        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        
        //   SLOT: tag 
        if (slotValues.search.heardAs && slotValues.search.heardAs !== '') {
            slotStatus = await featureRequest.sendFeatureRequest(slotValues.search.heardAs, sessionAttributes.email);
        } else {
            slotStatus += ERR_MESSAGE;
            shouldEndSession = false;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    },
};

const getEarningsByDate_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getEarningsByDate' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
            shouldEndSession = false;
        } else {

            let slotValues = getSlotValues(request.intent.slots); 
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            
            //   SLOT: date 
            if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
                slotStatus = await blitzbudgetDB.getEarningsByDateFromAlexa(wallet.sk.S, slotValues.date.heardAs, wallet.currency.S);
            } else {
                slotStatus += ERR_MESSAGE;
                shouldEndSession = false;
            }
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    }
}

const getExpenditureByDate_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getExpenditureByDate' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
            shouldEndSession = false;
        } else {
            let slotValues = getSlotValues(request.intent.slots); 
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            
            //   SLOT: date 
            if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
                slotStatus = await blitzbudgetDB.getExpenditureByDateFromAlexa(wallet.sk.S, slotValues.date.heardAs, wallet.currency.S);
            } else {
                slotStatus += ERR_MESSAGE;
                shouldEndSession = false;
            }
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    }
}

const getTransactionTotalByDate_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getTransactionTotalByDate' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
            shouldEndSession = false;
        } else {
            let slotValues = getSlotValues(request.intent.slots); 
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            
            //   SLOT: date 
            if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
                slotStatus = await blitzbudgetDB.getTransactionTotalByDateFromAlexa(wallet.sk.S, slotValues.date.heardAs, wallet.currency.S);
            } else {
                slotStatus += ERR_MESSAGE;
                shouldEndSession = false;
            }
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    }
}

const addCategoryByDate_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'addCategoryByDate' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots);
        
        if(isEmpty(slotValues.categoryType.heardAs)) {
            slotStatus = EMPTY_CATEGORY_TYPE;
            shouldEndSession = false;
        } else {
            
            if(isEmpty(wallet)) {
                slotStatus += EMPTY_WALLET;
                shouldEndSession = false;
            } else {
                // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

                // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
                
                // Date
                let currentDate =  new Date();
                // Date used to get the budget
                if(isNotEmpty(slotValues.date.heardAs)) {
                    let dateMentioned = slotValues.date.heardAs;
                    console.log("The Date mentioned is ", dateMentioned);
                    if(dateMentioned.length < 6) {
                        // For example is 2019 then become 2019-09
                        dateMentioned = dateMentioned + '-' + (currentDate.getMonth() + 1);
                    }
                    currentDate =  new Date(dateMentioned);
                }
                currentDate = currentDate.getFullYear() + '-' + ("0" + (Number(currentDate.getMonth()) + 1)).slice(-2);
                // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
        
                // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
                //   SLOT: category
                if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
                    let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, currentDate);
                    if(isEmpty(category)) {
                        slotStatus = await blitzbudgetDB.addCategoryByDateFromAlexa(wallet.sk.S, slotValues.date.heardAs, slotValues.category.heardAs, slotValues.categoryType.id);
                        // Successfully change budget amount then
                        if(includesStr(slotStatus, SUCCESSFUL_TITLE)) {
                            // Send a simple card to Alexa on Success
                            responseBuilder.withSimpleCard(CARD_SECURITY_TITLE, ADDED_NEW_CATEGORY_SIMPLE_CARD);   
                        }
                    } else {
                        slotStatus += CATEGORY_EXISTS + slotValues.category.heardAs;
                        shouldEndSession = false;
                    }
                } else {
                    slotStatus += ERR_MESSAGE;
                    shouldEndSession = false;
                }
            }   
        }

        say += slotStatus;

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
    }
}

const verifyVoiceCode_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'lostVoiceCode' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('The User id retrieved is ', sessionAttributes.userId);

        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = getSlotValues(request.intent.slots); 
        
        if (slotValues.voicecode.heardAs && slotValues.voicecode.heardAs !== '') {
            if(isEqual(slotValues.voicecode.heardAs, sessionAttributes.voiceCode)) {
                sessionAttributes.voiceCodeVerified = true;
            } else {
                // TODO Store number of failed attempts
                // TODO say back if the attempt has failed
                sessionAttributes.voiceCodeVerified = false;
            }
        }
        
        let say = SESSION_VERIFIED;
        
        return responseBuilder
            .speak(say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
        
    }
}

const lostVoiceCode_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'lostVoiceCode' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        
        let say = LOST_VOICE_CODE;
        
        return responseBuilder
            .speak(say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
        
    }
}

const LaunchRequest_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const repromptOutput = GREETING_MESSAGE;
        const speakOutput = HELLO_MESSAGE + sessionAttributes.firstName + repromptOutput;
        return handlerInput.responseBuilder
          .speak(speakOutput)
          .reprompt(repromptOutput)
          .getResponse();
    },
};

const SessionEndedHandler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
        return handlerInput.responseBuilder.getResponse();
    }
};

const ErrorHandler =  {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const request = handlerInput.requestEnvelope.request;

        console.log(`Error handled: ${error.message}`);
        // console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
        const speakOutput = ERR_MESSAGE;

        return handlerInput.responseBuilder
            .speak(`${speakOutput}  ${error.message} `)
            .reprompt(`${speakOutput}  ${error.message} `)
            .getResponse();
    }
};


// 2. Constants ===========================================================================

    // Here you can define static data, to be used elsewhere in your code.  For example: 
    //    const myString = "Hello World";
    //    const myArray  = [ "orange", "grape", "strawberry" ];
    //    const myObject = { "city": "Boston",  "state":"Massachusetts" };

// 3.  Helper Functions ===================================================================

function capitalize(myString) {

     return myString.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); }) ;
}

 
function randomElement(myArray) { 
    return(myArray[Math.floor(Math.random() * myArray.length)]); 
} 
 
function stripSpeak(str) { 
    return(str.replace('<speak>', '').replace('</speak>', '')); 
} 
 
 
function getSlotValues(filledSlots) { 
    const slotValues = {}; 
 
    Object.keys(filledSlots).forEach((item) => { 
        const name  = filledSlots[item].name; 
        console.log("The Slot Values calculated are", JSON.stringify(filledSlots[item]));
        
        if (filledSlots[item] && 
            filledSlots[item].resolutions && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0] && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status && 
            filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) { 
                
                let slotId = '';
                if(filledSlots[item].resolutions.resolutionsPerAuthority[0].values
                && filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id) {
                    slotId = filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.id;
                }
                
                switch (filledSlots[item].resolutions.resolutionsPerAuthority[0].status.code) { 
                    case 'ER_SUCCESS_MATCH': 
                        slotValues[name] = { 
                            heardAs: filledSlots[item].value, 
                            resolved: filledSlots[item].resolutions.resolutionsPerAuthority[0].values[0].value.name, 
                            id: slotId, 
                            ERstatus: 'ER_SUCCESS_MATCH' 
                        }; 
                        break; 
                    case 'ER_SUCCESS_NO_MATCH': 
                        slotValues[name] = { 
                            heardAs: filledSlots[item].value, 
                            resolved: '',
                            id: slotId, 
                            ERstatus: 'ER_SUCCESS_NO_MATCH' 
                        }; 
                        break; 
                    default: 
                        break; 
                } 
        } else { 
            slotValues[name] = { 
                heardAs: filledSlots[item].value || '', // may be null 
                resolved: '', 
                ERstatus: '' 
            }; 
        } 
    }, this); 
 
    return slotValues; 
} 
 
function getCustomIntents() { 
    const modelIntents = model.interactionModel.languageModel.intents; 
 
    let customIntents = []; 
 
 
    for (let i = 0; i < modelIntents.length; i++) { 
 
        if(modelIntents[i].name.substring(0,7) != "AMAZON." && modelIntents[i].name !== "LaunchRequest" ) { 
            customIntents.push(modelIntents[i]); 
        } 
    } 
    return customIntents; 
} 
 
function getSampleUtterance(intent) { 
 
    return randomElement(intent.samples); 
 
} 
 
function getPreviousSpeechOutput(attrs) { 
 
    if (attrs.lastSpeechOutput && attrs.history.length > 1) { 
        return attrs.lastSpeechOutput; 
 
    } else { 
        return false; 
    } 
 
}
 
const InitMemoryAttributesInterceptor = { 
    process(handlerInput) { 
        let sessionAttributes = {}; 
        if(handlerInput.requestEnvelope.session['new']) { 
 
            sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
 
            let memoryAttributes = getMemoryAttributes(); 
 
            if(Object.keys(sessionAttributes).length === 0) { 
 
                Object.keys(memoryAttributes).forEach(function(key) {  // initialize all attributes from global list 
 
                    sessionAttributes[key] = memoryAttributes[key]; 
 
                }); 
 
            } 
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
 
 
        } 
    } 
}; 
 
const RequestHistoryInterceptor = { 
    process(handlerInput) { 
 
        const thisRequest = handlerInput.requestEnvelope.request; 
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
 
        let history = sessionAttributes['history'] || []; 
 
        let IntentRequest = {}; 
        if (thisRequest.type === 'IntentRequest' ) { 
 
            let slots = []; 
 
            IntentRequest = { 
                'IntentRequest' : thisRequest.intent.name 
            }; 
 
            if (thisRequest.intent.slots) { 
 
                for (let slot in thisRequest.intent.slots) { 
                    let slotObj = {}; 
                    slotObj[slot] = thisRequest.intent.slots[slot].value; 
                    slots.push(slotObj); 
                } 
 
                IntentRequest = { 
                    'IntentRequest' : thisRequest.intent.name, 
                    'slots' : slots 
                }; 
 
            } 
 
        } else { 
            IntentRequest = {'IntentRequest' : thisRequest.type}; 
        } 
        if(history.length > maxHistorySize - 1) { 
            history.shift(); 
        } 
        history.push(IntentRequest); 
 
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
 
    } 
 
}; 
 
 
const RequestPersistenceInterceptor = { 
    process(handlerInput) { 
 
        if(handlerInput.requestEnvelope.session['new']) { 
 
            return new Promise((resolve, reject) => { 
 
                handlerInput.attributesManager.getPersistentAttributes() 
 
                    .then((sessionAttributes) => { 
                        sessionAttributes = sessionAttributes || {}; 
 
 
                        sessionAttributes['launchCount'] += 1; 
 
                        handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
 
                        handlerInput.attributesManager.savePersistentAttributes() 
                            .then(() => { 
                                resolve(); 
                            }) 
                            .catch((err) => { 
                                reject(err); 
                            }); 
                    }); 
 
            }); 
 
        } // end session['new'] 
    } 
}; 
 
 
const ResponseRecordSpeechOutputInterceptor = { 
    process(handlerInput, responseOutput) { 
 
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
        let lastSpeechOutput = { 
            "outputSpeech":responseOutput.outputSpeech.ssml, 
            "reprompt":responseOutput.reprompt.outputSpeech.ssml 
        }; 
 
        sessionAttributes['lastSpeechOutput'] = lastSpeechOutput; 
 
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes); 
 
    } 
}; 
 
const ResponsePersistenceInterceptor = { 
    process(handlerInput, responseOutput) { 
 
        const ses = (typeof responseOutput.shouldEndSession == "undefined" ? true : responseOutput.shouldEndSession); 
 
        if(ses || handlerInput.requestEnvelope.request.type == 'SessionEndedRequest') { // skill was stopped or timed out 
 
            let sessionAttributes = handlerInput.attributesManager.getSessionAttributes(); 
 
            sessionAttributes['lastUseTimestamp'] = new Date(handlerInput.requestEnvelope.request.timestamp).getTime(); 
 
            handlerInput.attributesManager.setPersistentAttributes(sessionAttributes); 
 
            return new Promise((resolve, reject) => { 
                handlerInput.attributesManager.savePersistentAttributes() 
                    .then(() => { 
                        resolve(); 
                    }) 
                    .catch((err) => { 
                        reject(err); 
                    }); 
 
            }); 
 
        } 
 
    } 
}; 

// Session Attributes 
//   Alexa will track attributes for you, by default only during the lifespan of your session.
//   The history[] array will track previous request(s), used for contextual Help/Yes/No handling.
//   Set up DynamoDB persistence to have the skill save and reload these attributes between skill sessions.

function getMemoryAttributes() {   const memoryAttributes = {
       "history":[],


       "launchCount":0,
       "lastUseTimestamp":0,

       "lastSpeechOutput":{},
       // "nextIntent":[]

       // "favoriteColor":"",
       // "name":"",
       // "namePronounce":"",
       // "email":"",
       // "mobileNumber":"",
       // "city":"",
       // "state":"",
       // "postcode":"",
       // "birthday":"",
       // "bookmark":0,
       // "wishlist":[],
   };
   return memoryAttributes;
};

const maxHistorySize = 20; // remember only latest 20 intents 

//
// HelpHandler: Handle a user request for help.
//
const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_MESSAGE)
      .getResponse();
  },
};

//
// ExitHandler: Handle the cancel and stop intents.
//
const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      (request.intent.name === 'AMAZON.CancelIntent' || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const speakOutput = GOODBYE_MESSAGE + sessionAttributes.firstName;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse();
  },
};

// Helper functions ========================================================

// getAttribute: Pass in array of name/value pairs and attribute name,
// return the attribute value corresponding to the provided attribute name.
//
function getAttribute(attrArray, attrName) {
  let value = 'NOTFOUND';
  for (let i = 0; i < attrArray.length; i += 1) {
    if (attrArray[i].Name === attrName) {
      value = attrArray[i].Value;
      break;
    }
  }
  return value;
}


// getUserData: Retrieve user details from Cognito IdSP
//
function getUserData(accToken) {
  return new Promise(((resolve, reject) => {
    const cognitoISP = new AWS.CognitoIdentityServiceProvider({ region: COGNITO_REGION });
    const cognitoParams = {
      AccessToken: accToken,
    };
    cognitoISP.getUser(cognitoParams, (error, data) => {
      if (error) {
        console.log('getUserData error : ', error);
        reject(error);
      } else {
        console.log('getUserData success : ', data);
        resolve(data);
      }
    });
  }));
}

function getResolvedSlotIDValue(request, slotName) {
  // assumes the first resolved value's id is the desired one
  const slot = request.intent.slots[slotName];

  if (slot &&
    slot.value &&
    slot.resolutions &&
    slot.resolutions.resolutionsPerAuthority &&
    slot.resolutions.resolutionsPerAuthority[0] &&
    slot.resolutions.resolutionsPerAuthority[0].values &&
    slot.resolutions.resolutionsPerAuthority[0].values[0] &&
    slot.resolutions.resolutionsPerAuthority[0].values[0].value &&
    slot.resolutions.resolutionsPerAuthority[0].values[0].value.name) {
    return slot.resolutions.resolutionsPerAuthority[0].values[0].value.id;
  }
  return null;
}

function triggerNeedToLinkAccounted(handlerInput) {
  // if there is an access token, then assumed linked
  return (handlerInput.requestEnvelope.session.user.accessToken === undefined);
}

/*
* Check if voice code is verified
* If voice code is empty -- It needs verification
*/
function checkIfVoiceCodeRequired(handlerInput) {
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    return sessionAttributes.voiceCodeVerified;
}

const RequestLog = {
  process(handlerInput) {
    console.log(`REQUEST ENVELOPE = ${JSON.stringify(handlerInput.requestEnvelope)}`);
  },
};

const ResponseLog = {
  process(handlerInput) {
    console.log(`RESPONSE BUILDER = ${JSON.stringify(handlerInput)}`);
    console.log(`RESPONSE = ${JSON.stringify(handlerInput.responseBuilder.getResponse())}`);
  },
};

function getEnvVar(envVarName, defaultValue) {
  if (process.env[envVarName]) {
    return process.env[envVarName];
  }
  return defaultValue;
}

// Includes String 
function includesStr(arr, val) {
    return isEmpty(arr) ? null : arr.includes(val);
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

    // Check if obj is an element
    if (obj instanceof Element) return false;

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

//
// GetLinkedInfoInterceptor: Interceptor function that is executed on every
// request sent to the skill
//
const GetLinkedInfoInterceptor = {
  async process(handlerInput) {
    if (handlerInput.requestEnvelope.session.new
      && handlerInput.requestEnvelope.session.user.accessToken) {
      // This is a new session and we have an access token,
      // so get the user details from Cognito and persist in session attributes
      const userData = await getUserData(handlerInput.requestEnvelope.session.user.accessToken);
      // console.log('GetLinkedInfoInterceptor: getUserData: ', userData);
      if (userData.Username !== undefined) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        sessionAttributes.firstName = getAttribute(userData.UserAttributes, 'name');
        sessionAttributes.surname = getAttribute(userData.UserAttributes, 'family_name');
        sessionAttributes.email = getAttribute(userData.UserAttributes, 'email');
        sessionAttributes.userId = getAttribute(userData.UserAttributes, 'custom:financialPortfolioId');
        // Get Alexa Voice Code
        const alexaVoiceCode = await blitzbudgetDB.getAlexaVoiceCode(sessionAttributes.userId);
        sessionAttributes.voiceCode = alexaVoiceCode['voice_code'].S;
        // Set Session Verified if user opted out
        if(isEqual(sessionAttributes.voiceCode, OPTED_OUT_VOICE_CODE)) {
            sessionAttributes.voiceCodeVerified = true;
        } else {
            // If not then set verification to false
            sessionAttributes.voiceCodeVerified = false;
        }
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      } else {
        console.log('GetLinkedInfoInterceptor: No user data was found.');
      }
    }
  },
};

// 4. Exports handler function and setup ===================================================
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
    .addRequestHandlers(
        CheckAccountLinkedHandler,
        CheckVoiceCodeVerifiedHandler,
        AMAZON_CancelIntent_Handler, 
        AMAZON_HelpIntent_Handler, 
        AMAZON_StopIntent_Handler, 
        AMAZON_NavigateHomeIntent_Handler, 
        AMAZON_FallbackIntent_Handler, 
        getWalletBalance_Handler,
        getRecentTransactions_Handler,
        getCategoryBalance_Handler, 
        addNewTransaction_Handler, 
        changeDefaultWallet_Handler, 
        changeDefaultAccount_Handler, 
        addNewBudget_Handler, 
        addNewGoal_Handler, 
        getBudgetBalance_Handler,
        getBudgetAmount_Handler, 
        getTagBalance_Handler, 
        changeBudgetAmount_Handler, 
        getDefaultWallet_Handler, 
        getDefaultAccount_Handler, 
        addNewWallet_Handler,
        sendFeatureRequest_Handler,
        getTransactionTotalByDate_Handler,
        getExpenditureByDate_Handler,
        getEarningsByDate_Handler,
        addCategoryByDate_Handler,
        lostVoiceCode_Handler,
        verifyVoiceCode_Handler,
        LaunchRequest_Handler, 
        HelpHandler,
        ExitHandler,
        SessionEndedHandler
    )
    .addErrorHandlers(ErrorHandler)
    .addRequestInterceptors(InitMemoryAttributesInterceptor)
    .addRequestInterceptors(RequestHistoryInterceptor)
    .addRequestInterceptors(GetLinkedInfoInterceptor)

   // .addResponseInterceptors(ResponseRecordSpeechOutputInterceptor)

 // .addRequestInterceptors(RequestPersistenceInterceptor)
 // .addResponseInterceptors(ResponsePersistenceInterceptor)

 // .withTableName("askMemorySkillTable")
 // .withAutoCreateTable(true)

    .lambda();


// End of Skill code -------------------------------------------------------------
// Static Language Model for reference

const model = {
    "interactionModel": {
        "languageModel": {
            "intents": [
                {
                    "name": "getCategoryBalance",
                    "slots": [
                        {
                            "name": "category",
                            "type": "CATEGORY"
                        },
                        {
                            "name": "date",
                            "type": "AMAZON.DATE"
                        }
                    ],
                    "samples": [
                        "How much I spent on Beauty",
                        "Get my category balance for Beauty category",
                        "Get my category balance for January",
                        "How much did I spend on Beauty category January",
                        "How much did I earn on Extra Income category January",
                        "How much did I spend on restaurant category",
                        "How much did I earn on salary category",
                        "Whats the balance of groceries category for January",
                        "Whats the balance of groceries category",
                        "What is the balance of  groceries category",
                        "How much did I earn on extra income",
                        "How much did I spend on party ",
                        "What's the balance of bills"
                    ]
                },
                {
                    "name": "addNewTransaction",
                    "slots": [
                        {
                            "name": "number",
                            "type": "AMAZON.NUMBER",
                            "samples": [
                                "One"
                            ]
                        },
                        {
                            "name": "currency",
                            "type": "CURRENCY"
                        },
                        {
                            "name": "categories",
                            "type": "CATEGORY",
                            "samples": [
                                "{categories}"
                            ]
                        },
                        {
                            "name": "date",
                            "type": "AMAZON.DATE"
                        }
                    ],
                    "samples": [
                        "Add a transaction with One Euro in {categories} category",
                        "Add a transaction for {categories}",
                        "Add a transaction with One Euro for {categories} category",
                        "Add a transaction with One Euro for {categories}",
                        "Add a transaction with One Euro in {categories} category for the January ",
                        "Add a transaction with One Euro in {categories} category for January",
                        "Add a transaction with One Euro in {categories}",
                        "Add a transaction with One Euro",
                        "Add a new transaction with One Euro in {categories} category for January",
                        "Add a new transaction with One Euro in {categories} category for the February",
                        "Add a new transaction with One Euro in {categories} category",
                        "Add a new transaction with One Euro for {categories} category",
                        "Add a new transaction for One Euro February",
                        "Add a new transaction with One",
                        "Add a new transaction with One Euro February",
                        "Add a new transaction with One Euro",
                        "Add a new transaction for {categories}",
                        "Add a new transaction of {categories} for One Euro",
                        "I spent One Euro February on {categories}",
                        "I earned One Euro February on {categories}",
                        "I received One Euro February on {categories}",
                        "I just received One Euro on {categories}"
                    ]
                },
                {
                    "name": "changeDefaultWallet",
                    "slots": [
                        {
                            "name": "wallet",
                            "type": "CURRENCY",
                            "samples": [
                                "{wallet}"
                            ]
                        }
                    ],
                    "samples": [
                        "Change default wallet to {wallet}",
                        "Change the default wallet to {wallet}",
                        "I want to change my default wallet to {wallet}",
                        "Change my default wallet to {wallet}"
                    ]
                },
                {
                    "name": "changeDefaultAccount",
                    "slots": [
                        {
                            "name": "account",
                            "type": "AMAZON.SearchQuery",
                            "samples": [
                                "HSBC"
                            ]
                        }
                    ],
                    "samples": [
                        "Change my default account to HSBC instead",
                        "My default account is HSBC",
                        "Change default account to HSBC",
                        "Change the default account to HSBC",
                        "I want to change my default account to HSBC",
                        "Change my default account to HSBC"
                    ]
                },
                {
                    "name": "addNewBudget",
                    "slots": [
                        {
                            "name": "category",
                            "type": "CATEGORY",
                            "samples": [
                                "learning category",
                                "learning"
                            ]
                        },
                        {
                            "name": "amount",
                            "type": "AMAZON.NUMBER"
                        },
                        {
                            "name": "currency",
                            "type": "CURRENCY"
                        }
                    ],
                    "samples": [
                        "Add a budget for learning category for One Euro ",
                        "Add a new budget for learning category for One Euro",
                        "Add a budget with learning category",
                        "Add a new budget for learning category",
                        "Add a new budget with learning category for One Euro",
                        "Add a budget with learning category for One Euro ",
                        "Add a new budget in learning",
                        "Add a new budget with learning",
                        "Add a new budget with miscellaneous category",
                        "Add a budget in groceries category for One Euro",
                        "Add a new budget in groceries category for One Euro",
                        "Add a budget in groceries category",
                        "Add a new budget in groceries category ",
                        "Add a budget for groceries",
                        "Add a budget of One  Euro  for groceries",
                        "Add a budget of One for groceries",
                        "Add a budget for One Euro",
                        "Add a budget for One",
                        "Add a new budget for One",
                        "Add a new budget for One Euro",
                        "Add a new budget of One for groceries",
                        "Add a new budget of One  Euro  for groceries ",
                        "Add a new budget for groceries"
                    ]
                },
                {
                    "name": "addNewGoal",
                    "slots": [
                        {
                            "name": "goaltype",
                            "type": "GOAL_TYPE"
                        },
                        {
                            "name": "amount",
                            "type": "AMAZON.NUMBER",
                            "samples": [
                                "I want my target amount to be One Euro",
                                "One Euro",
                                "I want my target amount to be One",
                                "One"
                            ]
                        },
                        {
                            "name": "currency",
                            "type": "CURRENCY"
                        },
                        {
                            "name": "monthlyContribution",
                            "type": "AMAZON.NUMBER",
                            "samples": [
                                "I want my monthly conribution to be One Euro",
                                "I want my monthly conribution to be One ",
                                "I want to contribute One Euro",
                                "I want to contribute One",
                                "One",
                                "One Euro"
                            ]
                        },
                        {
                            "name": "targetDate",
                            "type": "AMAZON.DATE",
                            "samples": [
                                "I want to fulfil my goal by {targetDate}",
                                "{targetDate}"
                            ]
                        }
                    ],
                    "samples": [
                        "Add a new goal with a monthly contribution of One Euro",
                        "Add a goal with a monthly contribution of One Euro",
                        "Add a Improve my home goal with a target amount of One Euro with a target date of {targetDate} and a monthly contribution of One ",
                        "Add a Improve my home goal with a target amount of One Euro with a target date of {targetDate}",
                        "Add a new Improve my home goal with a target amount of One Euro with a target date of {targetDate}",
                        "Add a new goal with a target amount of One Euro with a target date of {targetDate}",
                        "Add a goal with a target amount of One Euro with a target date of {targetDate}",
                        "Add a goal for Improve my home with a goal of One Euro and a monthly contribution of One",
                        "Add a goal for Improve my home with a target amount of One Euro",
                        "Add a goal for Improve my home with One Euro",
                        "Add a goal with a target date of {targetDate}",
                        "Add a goal with a monthly contribution of One",
                        "Add a goal with a target amount of One Euro",
                        "Add a new goal with a target amount of One Euro",
                        "Add a new goal with a final amount of One Euro",
                        "Add a new goal for Improve my home with a goal of One Euro and a monthly contribution of One",
                        "Add a new goal with a monthly contribution of One",
                        "Add a new goal with a target date of Improve my home",
                        "Add a new goal for Improve my home with One Euro",
                        "Add a new goal for Improve my home with a goal of One Euro",
                        "Add a new goal for Improve my home with a target amount of One Euro",
                        "Add a new goal for Improve my home "
                    ]
                },
                {
                    "name": "getBudgetBalance",
                    "slots": [
                        {
                            "name": "category",
                            "type": "CATEGORY",
                            "samples": [
                                "The balance of groceries category",
                                "I would like to know the balance of groceries category",
                                "I want to know the budget balance for groceries category",
                                "groceries category",
                                "groceries"
                            ]
                        }
                    ],
                    "samples": [
                        "Get my budget balance for groceries category",
                        "Get budget balance for groceries category",
                        "Get budget balance for groceries",
                        "Tell my budget balance for groceries category",
                        "Tell my budget balance for groceries",
                        "Tell me my budget balance for groceries category",
                        "Whats my budget balance for groceries category",
                        "Whats the budget balance for groceries category",
                        "Tell me my budget balance in groceries category",
                        "Tell me my budget balance in groceries",
                        "Whats the budget balance in groceries category",
                        "Whats the budget balance in groceries",
                        "Whats my budget balance in groceries category",
                        "What is my budget balance in groceries category ",
                        "Whats my budget balance in groceries"
                    ]
                },
                {
                    "name": "getTagBalance",
                    "slots": [
                        {
                            "name": "tag",
                            "type": "AMAZON.SearchQuery",
                            "samples": [
                                "I would like to know the balance for Monthly",
                                "I want to know the balance of Monthly",
                                "I would like to know the balance for Monthly tag",
                                "I want to know the balance of Monthly tag",
                                "Monthly tag",
                                "Monthly"
                            ]
                        }
                    ],
                    "samples": [
                        "Get the tag balance for Monthly",
                        "How much did I earn on Monthly tags",
                        "How much did I spend on Monthly tags",
                        "Tell me the expenditure of the Monthly tags",
                        "Whats my Monthly tags balance",
                        "Whats the Monthly tags balance",
                        "Get the Monthly tags balance",
                        "Get the Monthly tag balance",
                        "Whats the Monthly tag balance",
                        "Whats my Monthly tag balance",
                        "Tell the Monthly tag balance",
                        "Tel me the Monthly tag balance",
                        "Tell me the Monthly tags earnings",
                        "Tell me the Monthly tags expenditure",
                        " Tell me the expenditure of the Monthly tag",
                        "Tell me the Monthly tags amount ",
                        "How much did I spend on Monthly tag",
                        "How much did I earn on Monthly tag"
                    ]
                },
                {
                    "name": "changeBudgetAmount",
                    "slots": [
                        {
                            "name": "category",
                            "type": "CATEGORY",
                            "samples": [
                                "groceries category",
                                "groceries"
                            ]
                        },
                        {
                            "name": "currency",
                            "type": "CURRENCY"
                        },
                        {
                            "name": "amt",
                            "type": "AMAZON.NUMBER",
                            "samples": [
                                "The budget amount is One Euro",
                                "I would like tha budget amount to be One Euro",
                                "I would like tha budget amount to be One",
                                "One Euro",
                                "One"
                            ]
                        }
                    ],
                    "samples": [
                        "Change budget amount for groceries category",
                        "Change budget amount for groceries",
                        "Change my budget amount to One Euro for groceries category",
                        "Change my budget amount to One Euro",
                        "Change my budget amount to One Euro for groceries",
                        "Change my budget amount to One",
                        "Change the budget amount for groceries category",
                        "Change the budget for groceries category",
                        "Change the budget amount for rent",
                        "Change the budget for rent",
                        "Change budget to One Euro",
                        "Change rent budget amount to One Euro",
                        "Change rent budget amount to One",
                        "Change the rent budget amount to One Euro",
                        "Change the rent budget amount to One",
                        "Change the rent budgets amount to One",
                        "Change the rent budget to One",
                        "Change the rent budgets amount to One Euro",
                        "Change the rent budget to One Euro",
                        "Change the budget amount of rent to One Euro",
                        "Change the budget balance of rent to One"
                    ]
                },
                {
                    "name": "getDefaultWallet",
                    "slots": [],
                    "samples": [
                        "Get default wallet",
                        "Tell my default wallet",
                        "Whats the default wallet",
                        "Tell me my default wallet",
                        "Whas my default wallet",
                        "What is the default wallet",
                        "What is my default wallet"
                    ]
                },
                {
                    "name": "getDefaultAccount",
                    "slots": [],
                    "samples": [
                        "Get default account",
                        "Tell my default account",
                        "Tell me my default account",
                        "Whats the default account",
                        "Whats my default account",
                        "What is the default account",
                        "What is my default account"
                    ]
                },
                {
                    "name": "addNewWallet",
                    "slots": [
                        {
                            "name": "currency",
                            "type": "CURRENCY",
                            "multipleValues": {
                                "enabled": true
                            }
                        }
                    ],
                    "samples": [
                        "Add a new wallet for Euro currency",
                        "Add a new wallet for Euro",
                        "I want to add a new Euro wallet",
                        "Add a Euro wallet",
                        "Add new Euro wallet",
                        "Add a new wallet with currency as Euro",
                        "Can you add a Euro wallet",
                        "Add a new Euro wallet"
                    ]
                },
                {
                    "name": "getBudgetAmount",
                    "slots": [
                        {
                            "name": "category",
                            "type": "CATEGORY",
                            "samples": [
                                "rent"
                            ]
                        },
                        {
                            "name": "date",
                            "type": "AMAZON.DATE"
                        }
                    ],
                    "samples": [
                        "Get my budget amount for restaurant category",
                        "Whats the amount for restaurant budget",
                        "Whats the budget amount for restaurant",
                        "Whats the budget for restaurant category",
                        "Whats the restaurant budget amount",
                        "What is the budget amount today",
                        "What is the budget amount for today",
                        "Whats the budget amount for today",
                        "Whats the budget amount today",
                        "Whats the restaurant budget amount today",
                        "Whats the restaurant budget amount for  today",
                        "Whats the restaurant budget",
                        "Whats the budget for restaurant",
                        "What is the budget amount for restaurant",
                        "What is the budget for restaurant",
                        "Whats the amount of restaurant budget for today"
                    ]
                },
                {
                    "name": "sendFeatureRequest",
                    "slots": [
                        {
                            "name": "search",
                            "type": "AMAZON.SearchQuery",
                            "samples": [
                                "add a new tag"
                            ]
                        }
                    ],
                    "samples": [
                        "Send Blitz Budget a new feature to add a new tag",
                        "Send a new feature to add a new tag",
                        "Send a new feature for add a new tag",
                        "Send a new feature request to add a new tag",
                        "Send a new feature request for add a new tag",
                        "Send Blitz Budget a feature request to add a new tag",
                        "Send a feature request to add a new tag"
                    ]
                },
                {
                    "name": "getTransactionTotalByDate",
                    "slots": [
                        {
                            "name": "date",
                            "type": "AMAZON.DATE",
                            "samples": [
                                "today"
                            ]
                        }
                    ],
                    "samples": [
                        "Whats my total transaction for today",
                        "What is my total transaction for today",
                        "Whats the total transaction for this year",
                        "What is the total transaction this year",
                        "Whats my total transaction this year",
                        "What is the transaction total this month",
                        "What is the transaction total for this month",
                        "Whats the transaction total for this month",
                        "What is my transaction total for this month",
                        "What is my transaction total this month",
                        "Whats my transaction total this month",
                        "Whats my transaction total for this month"
                    ]
                },
                {
                    "name": "getEarningsByDate",
                    "slots": [
                        {
                            "name": "date",
                            "type": "AMAZON.DATE",
                            "samples": [
                                "this month"
                            ]
                        }
                    ],
                    "samples": [
                        "Get my income today",
                        "Get my income for this month",
                        "What is my income this month",
                        "Whats my income this month",
                        "What is my total income this month",
                        "Whats my total income this month",
                        "How much did I earn this month"
                    ]
                },
                {
                    "name": "getExpenditureByDate",
                    "slots": [
                        {
                            "name": "date",
                            "type": "AMAZON.DATE",
                            "samples": [
                                "this month"
                            ]
                        }
                    ],
                    "samples": [
                        "Get my expense for last month",
                        "Get my expense last month",
                        "How much did I spend in last month",
                        "What is my expenditure last month",
                        "Whats the expenditure last month",
                        "What is the expenditure for last month",
                        "Whats my expenditure last month",
                        "How much did I spend last month "
                    ]
                },
                {
                    "name": "addCategoryByDate",
                    "slots": [
                        {
                            "name": "category",
                            "type": "CATEGORY",
                            "samples": [
                                "I want to add restaurant category",
                                "I want to add restaurant",
                                "restaurant"
                            ]
                        },
                        {
                            "name": "date",
                            "type": "AMAZON.DATE"
                        },
                        {
                            "name": "categoryType",
                            "type": "CATEGORY_TYPE",
                            "samples": [
                                "I choose {categoryType}",
                                "I want to choose {categoryType}",
                                "{categoryType}"
                            ]
                        }
                    ],
                    "samples": [
                        "Add a restaurant category for September",
                        "Add a restaurant category with {categoryType} for September",
                        "Add a restaurant category for {categoryType} type",
                        "Add a category for restaurant with {categoryType} type",
                        "Add a category for shopping in {categoryType} type for September",
                        "Add a category for shopping in {categoryType} type",
                        "Add a category for shopping",
                        "Add a new category for shopping in {categoryType} type",
                        "Add a new category for shopping in {categoryType} type for September",
                        "Add a new category for shopping in September",
                        "Add a new category for shopping for September",
                        "Add a new category for shopping with {categoryType} type for September",
                        "Add a new category for shopping with {categoryType} type",
                        "Add a new shopping category for the  {categoryType} type",
                        "Add a new shopping category for {categoryType} type",
                        "Add a new shopping category for the September",
                        "Add a new shopping category with {categoryType} for the  September",
                        "Add a new shopping category with {categoryType} for September",
                        "Add a new learning category for September",
                        "Add a new category for September",
                        "Add a new category for learning"
                    ]
                }
            ]
        }
    }
}
