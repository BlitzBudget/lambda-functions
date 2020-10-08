// Lambda Function code for Alexa.
// Paste this into your index.js file. 
// alexa.design/codegenerator

// Setup ================================================================================

const https = require("https");
const AWS = require('aws-sdk');
const Alexa = require("ask-sdk-core");
const utils = require('./helper/utils');
const constants = require('./constants/constant.js');
const addData = require('./blitz-budget/add-data');
const changeData = require('./blitz-budget/change-data');
const fetchData = require('./blitz-budget/fetch-data');
const blitzbudgetDB = require('./helper/blitz-budget');
const featureRequest = require('./helper/feature-request');
const voiceCodeVerifier = require('./voice-code/verification');

// Constants ============================================================================

// TODO: clean up debugging code
// const DEBUG = getEnvVar('DEBUG', false); // true = log to CloudWatch Logs ; false = no logging
const COGNITO_REGION = getEnvVar('COGNITO_REGION', 'eu-west-1');


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
    const speakOutput = constants.NEED_TO_LINK_MESSAGE;
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
        const responseBuilder = handlerInput.responseBuilder;


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
        const responseBuilder = handlerInput.responseBuilder;

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
        const responseBuilder = handlerInput.responseBuilder;


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
        const responseBuilder = handlerInput.responseBuilder;

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
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

        let previousSpeech = getPreviousSpeechOutput(sessionAttributes);

        return responseBuilder
            .speak('Sorry I didnt catch what you said, ' + stripSpeak(previousSpeech.outputSpeech))
            .reprompt(stripSpeak(previousSpeech.reprompt))
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

        let slotValues = utils.getSlotValues(request.intent.slots); 
        // utils.getSlotValues returns .heardAs, .resolved, and .isValidated for each slot, according to request slot status codes ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

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


const LaunchRequest_Handler =  {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const repromptOutput = constants.GREETING_MESSAGE;
        const speakOutput = constants.HELLO_MESSAGE + sessionAttributes.firstName + repromptOutput;
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
        const speakOutput = constants.ERR_MESSAGE;

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
      .speak(constants.HELP_MESSAGE)
      .reprompt(constants.HELP_MESSAGE)
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
    const speakOutput = constants.GOODBYE_MESSAGE + sessionAttributes.firstName;
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
    console.log("The access token from the cognito is " + handlerInput.requestEnvelope.session.user.accessToken);
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
      // Get Session Attributes
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      // console.log('GetLinkedInfoInterceptor: getUserData: ', userData);
      if (userData.Username !== undefined && utils.isEmpty(sessionAttributes.userId)) {
        sessionAttributes.firstName = getAttribute(userData.UserAttributes, 'name');
        sessionAttributes.surname = getAttribute(userData.UserAttributes, 'family_name');
        sessionAttributes.email = getAttribute(userData.UserAttributes, 'email');
        sessionAttributes.userId = getAttribute(userData.UserAttributes, 'custom:financialPortfolioId');
        // Get Alexa Voice Code
        const alexaVoiceCode = await voiceCodeVerifier.getAlexaVoiceCode(sessionAttributes.userId);
        // Set Number of times failed
        sessionAttributes.numberOfTimesVoiceVerificationFailed = 0;
        // Set Session Verified if user opted out
        if(utils.isEmpty(alexaVoiceCode)) {
            sessionAttributes.voiceCodeVerified = true;
        } else {
            // Get the first voice code
            const alexaVoiceCodeEl = alexaVoiceCode[0];
            sessionAttributes.voiceCode = alexaVoiceCodeEl['voice_code'].S;
            // If not then set verification to false
            sessionAttributes.voiceCodeVerified = false;
            // Set Total voice code failure
            sessionAttributes.numberOfTimesVoiceVerificationFailed = alexaVoiceCodeEl['failure_rate'].N;
            // Store alexa voice id
            sessionAttributes.alexaVoiceCodeId = alexaVoiceCodeEl.sk.S
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
        voiceCodeVerifier.CheckVoiceCodeVerifiedHandler,
        voiceCodeVerifier.CheckIfVoiceCodeVerificationTriesExpired,
        AMAZON_CancelIntent_Handler, 
        AMAZON_HelpIntent_Handler, 
        AMAZON_StopIntent_Handler, 
        AMAZON_NavigateHomeIntent_Handler, 
        AMAZON_FallbackIntent_Handler, 
        fetchData.getWalletBalance_Handler,
        fetchData.getRecentTransactions_Handler,
        fetchData.getCategoryBalance_Handler, 
        addData.addNewTransaction_Handler, 
        changeData.changeDefaultWallet_Handler, 
        changeData.changeDefaultAccount_Handler, 
        addData.addNewBudget_Handler, 
        addData.addNewGoal_Handler, 
        fetchData.getBudgetBalance_Handler,
        fetchData.getBudgetAmount_Handler, 
        fetchData.getTagBalance_Handler, 
        changeData.changeBudgetAmount_Handler, 
        fetchData.getDefaultWallet_Handler, 
        fetchData.getDefaultAccount_Handler, 
        addData.addNewWallet_Handler,
        sendFeatureRequest_Handler,
        fetchData.getTransactionTotalByDate_Handler,
        fetchData.getExpenditureByDate_Handler,
        fetchData.getEarningsByDate_Handler,
        addData.addCategoryByDate_Handler,
        voiceCodeVerifier.lostVoiceCode_Handler,
        voiceCodeVerifier.verifyVoiceCode_Handler,
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
