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
const GREETING_MESSAGE =  '. What can I do for you today? ';
const CATEGORY_BALANCE_ERROR_TWO = ' category has a balance of ';
const GOODBYE_MESSAGE = 'Good bye %s. It was nice talking to you. ';
const GOAL_TYPE_ERROR = 'I didn\'t get the goal type. Please try again!';
const ERR_MESSAGE =  'Sorry, I can\'t understand that request. Please try again.';
const EMPTY_AMOUNT  = 'I didn\'t get the amount entered for the transaction. Please try again!';
const CURRENCY_NOTFOUND = 'I couldn\'t find the currency that you mentioned. Please try again!';
const EMPTY_TAG = ' tag is not present in any of the transactions.';
const EMPTY_CATEGORY = 'I didn\'t get the category entered for the transaction. Please try again!';
const EMPTY_WALLET = 'The requested currency cannot be found. Consider creating a wallet by saying "Create a new wallet for" followed by the currency name as you find it in the blitz budget application. ';
const HELP_MESSAGE = 'You can say: \'alexa, hello\', \'alexa, tell me my info\' or \'alexa, who am I\'.';
const CATEGORY_EMPTY = ' category has not been created. Consider creating a new category by saying "Create a new category for" followed by the category name';
const EMPTY_ACCOUNT = 'Sorry, There was an error while getting you default account. Please try again later!';
const BUDGET_NOT_CREATED = ' budget has not been created. Consider creating a budget for ';
const BUDGET_NOT_CREATED_TWO = ' by saying "Add a new budget for "';
const BUDGET_CREATED_ERROR = ' budget has already been created.';
const NEED_TO_LINK_MESSAGE = 'Before we can continue, you will need to link your account to the %s skill using the card that I have sent to the Alexa app.';
const CATEGORY_EXISTS = 'The selected category is already present for the mentioned dates. Please use the existing category.';
const EMPTY_CATEGORY_TYPE = 'The category type cannot be empty. Please try again!';


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
    return isAccountLinked(handlerInput);
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = NEED_TO_LINK_MESSAGE + SKILL_NAME;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withLinkAccountCard()
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

        let say = 'You asked for help. '; 

        let previousIntent = getPreviousIntent(sessionAttributes);
        if (previousIntent && !handlerInput.requestEnvelope.session.new) {
             say += 'Your last intent was ' + previousIntent + '. ';
         }
        // say +=  'I understand  ' + intents.length + ' intents, '

        say += ' Here something you can ask me, ' + getSampleUtterance(sampleIntent);

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

const getCategoryBalance_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'getCategoryBalance' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('The User id retrieved is {0}', sessionAttributes.userId);
        let wallet = await blitzbudgetDB.getDefaultAlexaWallet(sessionAttributes.userId);
        
        console.log('The wallets obtained are ', JSON.stringify(wallet));
        let say = '';

        let slotStatus = '';
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: category 
        if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
            let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, slotValues.date.heardAs);
            if(isEmpty(category)) {
                slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY;
            } else {
                slotStatus += YOUR_MESSAGE + slotValues.category.heardAs + CATEGORY_BALANCE_ERROR_TWO + category['category_total'].N + ' ' + wallet.currency.S;   
            }
        } else {
            slotStatus += ERR_MESSAGE;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot, wallet;
        
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
                        slotStatus = THE_MESSAGE + slotValues.categories.heardAs + CATEGORY_EMPTY;
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
                    }
                } else {
                    slotStatus = EMPTY_CATEGORY;
                }
                
            }
        } 

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;

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
            } else {
                console.log("The wallet currency to change is ", walletCurrency);
                let allWallets = await blitzbudgetDB.getWalletFromAlexa(sessionAttributes.userId);
                let changeWallet = await blitzbudgetDB.changeDefaultWalletAlexa(sessionAttributes.userId, allWallets, walletCurrency);
                slotStatus += changeWallet;   
            }
        } else {
            slotStatus += ERR_MESSAGE;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: account 
        if (slotValues.account.heardAs && slotValues.account.heardAs !== '') {
            let allAccounts = await blitzbudgetDB.getAccountFromAlexa(wallet.sk.S);
            let changeAccount = await blitzbudgetDB.changeDefaultAccountAlexa(allAccounts, slotValues.account.heardAs);
            slotStatus = changeAccount;
        } else {
            slotStatus = ERR_MESSAGE;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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

        let say = '';
        let slotStatus = '';
        let resolvedSlot, wallet;

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
        } else {
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            //   SLOT: category 
            if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
                let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, currentDate);
                if(isEmpty(category)) {
                    slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY;
                } else {
                    let budget = await blitzbudgetDB.getBudgetAlexaAmount(wallet.sk.S, category.sk.S, currentDate);
                    if(isEmpty(budget)) {
                        slotStatus += await blitzbudgetDB.addBudgetAlexaAmount(wallet.sk.S, category.sk.S, slotValues.amount.heardAs, currentDate, slotValues.category.heardAs);
                    } else {
                        slotStatus += THE_MESSAGE + slotValues.category.heardAs + BUDGET_CREATED_ERROR;
                    }
                }
            } else {
                slotStatus += ERR_MESSAGE;
            }
            
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        } else {
            if(isEmpty(slotValues.goaltype.heardAs)) {
                slotStatus = GOAL_TYPE_ERROR;
            } else {
                slotStatus = await blitzbudgetDB.addNewGoalFromAlexa(wallet.sk.S, slotValues.amount.heardAs, slotValues.goaltype.id, slotValues.monthlyContribution.heardAs, slotValues.targetDate.heardAs);
            }
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;

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
                slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY;
            } else {
                let budget = await blitzbudgetDB.getBudgetAlexaAmount(wallet.sk.S, category.sk.S, currentDate);
                if(isEmpty(budget)) {
                    slotStatus += THE_MESSAGE + slotValues.category.heardAs + BUDGET_CREATED_ERROR;
                } else {
                    slotStatus += YOUR_MESSAGE + slotValues.category.heardAs + BUDGET_RETRIEVED + budget['planned'].N + ' ' + wallet.currency.S;   
                }
            }
        } else {
            slotStatus += ERR_MESSAGE;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        
        let say = '';

        let slotStatus = '';
        let resolvedSlot;

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
                slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY;
            } else {
                let budget = await blitzbudgetDB.getBudgetAlexaAmount(wallet.sk.S, category.sk.S, currentDate);
                if(isEmpty(budget)) {
                    slotStatus += THE_MESSAGE + slotValues.category.heardAs + BUDGET_NOT_CREATED + category['category_name'].S + BUDGET_NOT_CREATED_TWO + category['category_name'].S ;
                } else {
                    let budgetBalance = Number(budget['planned'].N) + Number(category['category_total'].N);
                    slotStatus += YOUR_MESSAGE + slotValues.category.heardAs + BUDGET_BALANCE_ONE + budgetBalance + ' ' + wallet.currency.S + BUDGET_BALANCE_TWO;   
                }
            }
        } else {
            slotStatus += ERR_MESSAGE;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;

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
            } else {
                slotStatus += YOUR_MESSAGE + slotValues.tag.heardAs + TAG_MESSAGE + tagBalance + ' ' + wallet.currency.S;   
            }
            console.log("The", slotValues.tag.heardAs, " tag has a balance of ", tagBalance);
        } else {
            slotStatus += ERR_MESSAGE;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
            .getResponse();
    },
};

const changeBudgetAmount_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'changeBudgetAmount' ;
    },
    async handle(handlerInput) {
        let wallet;
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
        let resolvedSlot;
        
        let currentDate =  new Date();
        currentDate = currentDate.getFullYear() + '-' + ("0" + (Number(currentDate.getMonth()) + 1)).slice(-2);
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
        } else {
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            //   SLOT: category 
            if (slotValues.category.heardAs && slotValues.category.heardAs !== '') {
                let category = await blitzbudgetDB.getCategoryAlexa(wallet.sk.S, slotValues.category.heardAs, currentDate);
                if(isEmpty(category)) {
                    slotStatus += THE_MESSAGE + slotValues.category.heardAs + CATEGORY_EMPTY;
                } else {
                    let budget = await blitzbudgetDB.getBudgetAlexaAmount(wallet.sk.S, category.sk.S, currentDate);
                    if(isEmpty(budget)) {
                        slotStatus += THE_MESSAGE + slotValues.category.heardAs + BUDGET_NOT_CREATED + category['category_name'].S + BUDGET_NOT_CREATED_TWO + category['category_name'].S;
                    } else {
                        slotStatus += await blitzbudgetDB.changeBudgetAlexaAmount(wallet.sk.S, budget.sk.S, slotValues.amt.heardAs, wallet.currency.S);
                    }
                }
            } else {
                slotStatus += ERR_MESSAGE;
            }
            
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let say;
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
        } else {
            let defaultAccount = await blitzbudgetDB.getDefaultAlexaAccount(wallet.sk.S);

            if(isEmpty(defaultAccount)) {
                say = EMPTY_ACCOUNT;
            } else {
                say = DEFAULT_ACCOUNT_SUCCESS + defaultAccount['bank_account_name'].S;
            }
        }

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        //   SLOT: currency 
        if (slotValues.currency.heardAs && slotValues.currency.heardAs !== '') {
            let matchedCurrency = blitzbudgetDB.checkIfWalletIsInvalid(slotValues.currency.heardAs);
            if(isEmpty(matchedCurrency)) {
               slotStatus = CURRENCY_NOTFOUND;
            } else {
                slotStatus = await blitzbudgetDB.addWalletFromAlexa(sessionAttributes.userId, matchedCurrency);   
            }
        } else {
            slotStatus += ERR_MESSAGE;
        }
        
        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots); 
        // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

        // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
        
        //   SLOT: tag 
        if (slotValues.search.heardAs && slotValues.search.heardAs !== '') {
            slotStatus = await featureRequest.sendFeatureRequest(slotValues.search.heardAs, sessionAttributes.email);
        } else {
            slotStatus += ERR_MESSAGE;
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
        } else {

            let slotValues = getSlotValues(request.intent.slots); 
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            
            //   SLOT: date 
            if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
                slotStatus = await blitzbudgetDB.getEarningsByDateFromAlexa(wallet.sk.S, slotValues.date.heardAs, wallet.currency.S);
            } else {
                slotStatus += ERR_MESSAGE;
            }
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
        } else {
            let slotValues = getSlotValues(request.intent.slots); 
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            
            //   SLOT: date 
            if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
                slotStatus = await blitzbudgetDB.getExpenditureByDateFromAlexa(wallet.sk.S, slotValues.date.heardAs, wallet.currency.S);
            } else {
                slotStatus += ERR_MESSAGE;
            }
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;
        
        if(isEmpty(wallet)) {
            slotStatus += EMPTY_WALLET;
        } else {
            let slotValues = getSlotValues(request.intent.slots); 
            // getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions
    
            // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));
            
            //   SLOT: date 
            if (slotValues.date.heardAs && slotValues.date.heardAs !== '') {
                slotStatus = await blitzbudgetDB.getTransactionTotalByDateFromAlexa(wallet.sk.S, slotValues.date.heardAs, wallet.currency.S);
            } else {
                slotStatus += ERR_MESSAGE;
            }
        }

        say += slotStatus;


        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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
        let resolvedSlot;

        let slotValues = getSlotValues(request.intent.slots);
        
        if(isEmpty(slotValues.categoryType.heardAs)) {
            slotStatus = EMPTY_CATEGORY_TYPE;
        } else {
            
            if(isEmpty(wallet)) {
                slotStatus += EMPTY_WALLET;
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
                    } else {
                        slotStatus += CATEGORY_EXISTS;
                    }
                } else {
                    slotStatus += ERR_MESSAGE;
                }
            }   
        }

        say += slotStatus;

        return responseBuilder
            .speak(say)
            .reprompt('try again, ' + say)
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

const APP_ID = undefined;  // TODO replace with your Skill ID (OPTIONAL).

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
 
function getExampleSlotValues(intentName, slotName) { 
 
    let examples = []; 
    let slotType = ''; 
    let slotValuesFull = []; 
 
    let intents = model.interactionModel.languageModel.intents; 
    for (let i = 0; i < intents.length; i++) { 
        if (intents[i].name == intentName) { 
            let slots = intents[i].slots; 
            for (let j = 0; j < slots.length; j++) { 
                if (slots[j].name === slotName) { 
                    slotType = slots[j].type; 
 
                } 
            } 
        } 
 
    } 
    let types = model.interactionModel.languageModel.types; 
    for (let i = 0; i < types.length; i++) { 
        if (types[i].name === slotType) { 
            slotValuesFull = types[i].values; 
        } 
    } 
 
    slotValuesFull = shuffleArray(slotValuesFull); 
 
    examples.push(slotValuesFull[0].name.value); 
    examples.push(slotValuesFull[1].name.value); 
    if (slotValuesFull.length > 2) { 
        examples.push(slotValuesFull[2].name.value); 
    } 
 
 
    return examples; 
} 
 
function sayArray(myData, penultimateWord = 'and') { 
    let result = ''; 
 
    myData.forEach(function(element, index, arr) { 
 
        if (index === 0) { 
            result = element; 
        } else if (index === myData.length - 1) { 
            result += ` ${penultimateWord} ${element}`; 
        } else { 
            result += `, ${element}`; 
        } 
    }); 
    return result; 
} 
function supportsDisplay(handlerInput) // returns true if the skill is running on a device with a display (Echo Show, Echo Spot, etc.) 
{                                      //  Enable your skill for display as shown here: https://alexa.design/enabledisplay 
    const hasDisplay = 
        handlerInput.requestEnvelope.context && 
        handlerInput.requestEnvelope.context.System && 
        handlerInput.requestEnvelope.context.System.device && 
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces && 
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display; 
 
    return hasDisplay; 
} 
 
 
const welcomeCardImg = { 
    smallImageUrl: "https://s3.amazonaws.com/skill-images-789/cards/card_plane720_480.png", 
    largeImageUrl: "https://s3.amazonaws.com/skill-images-789/cards/card_plane1200_800.png" 
 
 
}; 
 
const DisplayImg1 = { 
    title: 'Jet Plane', 
    url: 'https://s3.amazonaws.com/skill-images-789/display/plane340_340.png' 
}; 
const DisplayImg2 = { 
    title: 'Starry Sky', 
    url: 'https://s3.amazonaws.com/skill-images-789/display/background1024_600.png' 
 
}; 
 
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
 
function getPreviousIntent(attrs) { 
 
    if (attrs.history && attrs.history.length > 1) { 
        return attrs.history[attrs.history.length - 2].IntentRequest; 
 
    } else { 
        return false; 
    } 
 
} 
 
function getPreviousSpeechOutput(attrs) { 
 
    if (attrs.lastSpeechOutput && attrs.history.length > 1) { 
        return attrs.lastSpeechOutput; 
 
    } else { 
        return false; 
    } 
 
} 
 
function timeDelta(t1, t2) { 
 
    const dt1 = new Date(t1); 
    const dt2 = new Date(t2); 
    const timeSpanMS = dt2.getTime() - dt1.getTime(); 
    const span = { 
        "timeSpanMIN": Math.floor(timeSpanMS / (1000 * 60 )), 
        "timeSpanHR": Math.floor(timeSpanMS / (1000 * 60 * 60)), 
        "timeSpanDAY": Math.floor(timeSpanMS / (1000 * 60 * 60 * 24)), 
        "timeSpanDesc" : "" 
    }; 
 
 
    if (span.timeSpanHR < 2) { 
        span.timeSpanDesc = span.timeSpanMIN + " minutes"; 
    } else if (span.timeSpanDAY < 2) { 
        span.timeSpanDesc = span.timeSpanHR + " hours"; 
    } else { 
        span.timeSpanDesc = span.timeSpanDAY + " days"; 
    } 
 
 
    return span; 
 
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

function isAccountLinked(handlerInput) {
  // if there is an access token, then assumed linked
  return (handlerInput.requestEnvelope.session.user.accessToken === undefined);
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

function shuffleArray(array) {  // Fisher Yates shuffle! 
 
    let currentIndex = array.length, temporaryValue, randomIndex; 
 
    while (0 !== currentIndex) { 
 
        randomIndex = Math.floor(Math.random() * currentIndex); 
        currentIndex -= 1; 
 
        temporaryValue = array[currentIndex]; 
        array[currentIndex] = array[randomIndex]; 
        array[randomIndex] = temporaryValue; 
    } 
 
    return array; 
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
        AMAZON_CancelIntent_Handler, 
        AMAZON_HelpIntent_Handler, 
        AMAZON_StopIntent_Handler, 
        AMAZON_NavigateHomeIntent_Handler, 
        AMAZON_FallbackIntent_Handler, 
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
