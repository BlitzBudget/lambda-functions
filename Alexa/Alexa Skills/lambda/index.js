// Lambda Function code for Alexa.
// Paste this into your index.js file.
// alexa.design/codegenerator

// Setup ================================================================================

const AWS = require('aws-sdk');
const Alexa = require('ask-sdk-core');
const reference = require('./constants/reference');
const utils = require('./helper/utils');
const constants = require('./constants/constant.js');
const addData = require('./blitz-budget/add-data');
const changeData = require('./blitz-budget/change-data');
const fetchData = require('./blitz-budget/fetch-data');
const featureRequest = require('./helper/feature-request');
const voiceCodeVerifier = require('./voice-code/verification');

// Helper Functions ===================================================================

function randomElement(myArray) {
  return myArray[Math.floor(Math.random() * myArray.length)];
}

function stripSpeak(str) {
  return str.replace('<speak>', '').replace('</speak>', '');
}

function triggerNeedToLinkAccounted(handlerInput) {
  console.log(
    `The access token from the cognito is ${
      handlerInput.requestEnvelope.session.user.accessToken}`,
  );
  // if there is an access token, then assumed linked
  return handlerInput.requestEnvelope.session.user.accessToken === undefined;
}

function getEnvVar(envVarName, defaultValue) {
  if (process.env[envVarName]) {
    return process.env[envVarName];
  }
  return defaultValue;
}

// Session Attributes
//   Alexa will track attributes for you, by default only during the lifespan of your session.
//   The history[] array will track previous request(s), used for contextual Help/Yes/No handling.
//   Set up DynamoDB persistence to have the skill save
// and reload these attributes between skill sessions.

function getMemoryAttributes() {
  const memoryAttributes = {
    history: [],

    launchCount: 0,
    lastUseTimestamp: 0,

    lastSpeechOutput: {},
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
}

function getCustomIntents() {
  const modelIntents = reference.model.interactionModel.languageModel.intents;

  const customIntents = [];

  for (let i = 0; i < modelIntents.length; i++) {
    if (
      modelIntents[i].name.substring(0, 7) !== 'AMAZON.'
      && modelIntents[i].name !== 'LaunchRequest'
    ) {
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
  }
  return false;
}

const InitMemoryAttributesInterceptor = {
  process(handlerInput) {
    let sessionAttributes = {};
    if (handlerInput.requestEnvelope.session.new) {
      sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

      const memoryAttributes = getMemoryAttributes();

      if (Object.keys(sessionAttributes).length === 0) {
        Object.keys(memoryAttributes).forEach((key) => {
          // initialize all attributes from global list

          sessionAttributes[key] = memoryAttributes[key];
        });
      }
      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
    }
  },
};

//
// HelpHandler: Handle a user request for help.
//
const HelpHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(constants.HELP_MESSAGE)
      .reprompt(constants.HELP_MESSAGE)
      .getResponse();
  },
};

// Constants ============================================================================

// TODO: clean up debugging code
// const DEBUG = getEnvVar('DEBUG', false); // true = log to CloudWatch Logs ; false = no logging
const COGNITO_REGION = getEnvVar('COGNITO_REGION', process.env.AWS_LAMBDA_REGION);

const maxHistorySize = 20; // remember only latest 20 intents

// 1. Intent Handlers =============================================

// CheckAccountLinkedHandler: This handler is always run first,
// based on the order defined in the skillBuilder.
// If no access token is present, then send the Link Account Card.
// ``
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

const amazonCancelIntentHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.CancelIntent'
    );
  },
  handle(handlerInput) {
    const { responseBuilder } = handlerInput;

    const say = 'Okay, talk to you later! ';

    return responseBuilder.speak(say).withShouldEndSession(true).getResponse();
  },
};

const amazonHelpIntentHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const { responseBuilder } = handlerInput;

    const intents = getCustomIntents();
    const sampleIntent = randomElement(intents);

    let say = '';

    say
      += ` Here is something you can ask me, ${getSampleUtterance(sampleIntent)}`;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .getResponse();
  },
};

const amazonStopIntentHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.StopIntent'
    );
  },
  handle(handlerInput) {
    const { responseBuilder } = handlerInput;

    const say = 'Okay, talk to you later! ';

    return responseBuilder.speak(say).withShouldEndSession(true).getResponse();
  },
};

const amazonNavigateHomeIntentHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.NavigateHomeIntent'
    );
  },
  handle(handlerInput) {
    const { responseBuilder } = handlerInput;

    const say = 'Hello from AMAZON.NavigateHomeIntent. ';

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .getResponse();
  },
};

const amazonFallbackIntentHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.FallbackIntent'
    );
  },
  handle(handlerInput) {
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const previousSpeech = getPreviousSpeechOutput(sessionAttributes);

    return responseBuilder
      .speak(
        `Sorry I didnt catch what you said, ${
          stripSpeak(previousSpeech.outputSpeech)}`,
      )
      .reprompt(stripSpeak(previousSpeech.reprompt))
      .getResponse();
  },
};

const sendFeatureRequestHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'sendFeatureRequest'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    let say = '';

    let slotStatus = '';
    let shouldEndSession = true;

    const slotValues = utils.getSlotValues(request.intent.slots);
    // utils.getSlotValues returns .heardAs, .resolved, and
    // .isValidated for each slot, according to request slot status codes
    // ER_SUCCESS_MATCH, ER_SUCCESS_NO_MATCH, or traditional simple request slot without resolutions

    // console.log('***** slotValues: ' +  JSON.stringify(slotValues, null, 2));

    //   SLOT: tag
    if (slotValues.search.heardAs && slotValues.search.heardAs !== '') {
      slotStatus = await featureRequest.sendFeatureRequest(
        slotValues.search.heardAs,
        sessionAttributes.email,
      );
    } else {
      slotStatus += constants.ERR_MESSAGE;
      shouldEndSession = false;
    }

    say += slotStatus;

    return responseBuilder
      .speak(say)
      .reprompt(`try again, ${say}`)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

const launchRequestHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const repromptOutput = constants.GREETING_MESSAGE;
    const speakOutput = constants.HELLO_MESSAGE + sessionAttributes.firstName + repromptOutput;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

const SessionEndedHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`,
    );
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    // console.log(`Original Request was: ${JSON.stringify(request, null, 2)}`);
    const speakOutput = constants.ERR_MESSAGE;

    return handlerInput.responseBuilder
      .speak(`${speakOutput}  ${error.message} `)
      .reprompt(`${speakOutput}  ${error.message} `)
      .getResponse();
  },
};

// 2. Constants ===========================================================================

// Here you can define static data, to be used elsewhere in your code.  For example:
//    const myString = "Hello World";
//    const myArray  = [ "orange", "grape", "strawberry" ];
//    const myObject = { "city": "Boston",  "state":"Massachusetts" };

//
// ExitHandler: Handle the cancel and stop intents.
//
const ExitHandler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent')
    );
  },
  handle(handlerInput) {
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
  return new Promise((resolve, reject) => {
    const cognitoISP = new AWS.CognitoIdentityServiceProvider({
      region: COGNITO_REGION,
    });
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
  });
}

//
// GetLinkedInfoInterceptor: Interceptor function that is executed on every
// request sent to the skill
//
const GetLinkedInfoInterceptor = {
  async process(handlerInput) {
    if (
      handlerInput.requestEnvelope.session.new
      && handlerInput.requestEnvelope.session.user.accessToken
    ) {
      // This is a new session and we have an access token,
      // so get the user details from Cognito and persist in session attributes
      const userData = await getUserData(
        handlerInput.requestEnvelope.session.user.accessToken,
      );
      // Get Session Attributes
      const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
      // console.log('GetLinkedInfoInterceptor: getUserData: ', userData);
      if (
        userData.Username !== undefined
        && utils.isEmpty(sessionAttributes.userId)
      ) {
        sessionAttributes.firstName = getAttribute(
          userData.UserAttributes,
          'name',
        );
        sessionAttributes.surname = getAttribute(
          userData.UserAttributes,
          'family_name',
        );
        sessionAttributes.email = getAttribute(
          userData.UserAttributes,
          'email',
        );
        sessionAttributes.userId = getAttribute(
          userData.UserAttributes,
          'custom:financialPortfolioId',
        );
        // Get Alexa Voice Code
        const alexaVoiceCode = await voiceCodeVerifier.getAlexaVoiceCode(
          sessionAttributes.userId,
        );
        // Set Number of times failed
        sessionAttributes.numberOfTimesVoiceVerificationFailed = 0;
        // Set Session Verified if user opted out
        if (utils.isEmpty(alexaVoiceCode)) {
          sessionAttributes.voiceCodeVerified = true;
        } else {
          // Get the first voice code
          const alexaVoiceCodeEl = alexaVoiceCode[0];
          sessionAttributes.voiceCode = alexaVoiceCodeEl.voice_code.S;
          // If not then set verification to false
          sessionAttributes.voiceCodeVerified = false;
          // Set Total voice code failure
          sessionAttributes.numberOfTimesVoiceVerificationFailed = alexaVoiceCodeEl.failure_rate.N;
          // Store alexa voice id
          sessionAttributes.alexaVoiceCodeId = alexaVoiceCodeEl.sk.S;
        }
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      } else {
        console.log('GetLinkedInfoInterceptor: No user data was found.');
      }
    }
  },
};

const RequestHistoryInterceptor = {
  process(handlerInput) {
    const thisRequest = handlerInput.requestEnvelope.request;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const history = sessionAttributes.history || [];

    let IntentRequest = {};
    if (thisRequest.type === 'IntentRequest') {
      const slots = [];

      IntentRequest = {
        IntentRequest: thisRequest.intent.name,
      };

      if (thisRequest.intent.slots) {
        Object.keys(thisRequest.intent.slots).forEach((slot) => {
          const slotObj = {};
          slotObj[slot] = thisRequest.intent.slots[slot].value;
          slots.push(slotObj);
        });

        IntentRequest = {
          IntentRequest: thisRequest.intent.name,
          slots,
        };
      }
    } else {
      IntentRequest = { IntentRequest: thisRequest.type };
    }
    if (history.length > maxHistorySize - 1) {
      history.shift();
    }
    history.push(IntentRequest);

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
  },
};

// 4. Exports handler function and setup ===================================================
const skillBuilder = Alexa.SkillBuilders.custom();
exports.handler = skillBuilder
  .addRequestHandlers(
    CheckAccountLinkedHandler,
    voiceCodeVerifier.lostVoiceCode_Handler,
    voiceCodeVerifier.CheckIfVoiceCodeVerificationTriesExpired,
    voiceCodeVerifier.verifyVoiceCode_Handler,
    voiceCodeVerifier.CheckVoiceCodeVerifiedHandler,
    amazonCancelIntentHandler,
    amazonHelpIntentHandler,
    amazonStopIntentHandler,
    amazonNavigateHomeIntentHandler,
    amazonFallbackIntentHandler,
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
    sendFeatureRequestHandler,
    fetchData.getTransactionTotalByDate_Handler,
    fetchData.getExpenditureByDate_Handler,
    fetchData.getEarningsByDate_Handler,
    addData.addCategoryByDate_Handler,
    launchRequestHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedHandler,
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
