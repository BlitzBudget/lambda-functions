const VoiceCodeVerifier = () => {};
// Setup ================================================================================

const utils = require('../helper/utils');
const dbHelper = require('../helper/dbHelper');

// Constants ============================================================================

const MAX_RETRIES_ALLOWED = 3;
const ALREADY_VERIFIED = 'You are already a verified user!';
const SESSION_NOT_VERIFIED = 'The voice code provided was wrong! If you had forgotten your voice code, <break time="0.05s"/> you could disable and then reenable your Blitzbudget skill in alexa to set a new voice code.';
const LOST_VOICE_CODE = 'Sorry to hear that! You could disable the blitzbudget skill in Alexa and then re-enable it again.';
const LAST_VOICE_CODE_TRY = '<break time="0.10s"/> This is your last try, <break time="0.10s"/> after which you would be signed out of your account for security purposes!';
const SESSION_VERIFIED = '<amazon:emotion name="excited" intensity="low">Great! You session has been successfully verified. </amazon:emotion> How can I help you today?';
const VERIFY_VOICE_CODE = '<amazon:emotion name="disappointed" intensity="medium"> You need to verify your voice code. </amazon:emotion> Verify by saying <break time="0.20s"/> "Verify Blitz Budget " <break time="0.05s"/> followed by your four digit voice code';
const MAX_RETRIES_EXCEEDED = '<amazon:emotion name="disappointed" intensity="medium"> You have exceeded the maximum number of voice code verification tries.</amazon:emotion>  <break time="0.20s"/> Please disable and then re-enable the blitz budget skill.';

/*
 * Check if voice code is verified
 * If voice code is empty -- It needs verification
 */
function checkIfVoiceCodeRequired(handlerInput) {
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  return !sessionAttributes.voiceCodeVerified;
}

/*
 * Check if Maximum Voice Code Retries have exceeded
 */
function maximumVoiceCodeRetiresExceeded(handlerInput) {
  // Number of times voice verification has failed.
  const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
  const { numberOfTimesVoiceVerificationFailed } = sessionAttributes;
  console.log(
    'The number of times voice verification failed is ',
    numberOfTimesVoiceVerificationFailed,
  );
  return (
    utils.isNotEmpty(numberOfTimesVoiceVerificationFailed)
    && numberOfTimesVoiceVerificationFailed >= MAX_RETRIES_ALLOWED
  );
}

function changeAlexaVoiceCode(userId, alexaVoiceCodeId, failureRate) {
  console.log('The alexa voice code to change is for ', userId);
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      pk: {
        S: userId,
      },
      sk: {
        S: alexaVoiceCodeId,
      },
    },
    UpdateExpression: 'set #variable1 = :v1, #update = :u',
    ExpressionAttributeNames: {
      '#variable1': 'failure_rate',
      '#update': 'updated_date',
    },
    ExpressionAttributeValues: {
      ':v1': {
        N: failureRate,
      },
      ':u': {
        S: new Date().toISOString(),
      },
    },
    ReturnValues: 'UPDATED_NEW',
  };

  console.log(
    'Updating the account with a default alexa property ',
    JSON.stringify(params),
  );

  dbHelper
    .patchFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully patched the blitz budget from the DynamoDB. Item count is ${
          data.length}`,
      );
    })
    .catch((err) => {
      console.log('There was an error changing the budget from DynamoDB ', err);
    });
}

// CheckVoiceCodeVerifiedHandler: This handler is always run second,
// based on the order defined in the skillBuilder.
// If verification code is not set, then request it from the user.
VoiceCodeVerifier.prototype.CheckVoiceCodeVerifiedHandler = {
  canHandle(handlerInput) {
    // If voice code is required,
    // then return true
    return checkIfVoiceCodeRequired(handlerInput);
  },
  handle(handlerInput) {
    const speakOutput = VERIFY_VOICE_CODE;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(false) // End session for security purposes
      .getResponse();
  },
};

// CheckIfVoiceCodeVerificationTriesExpired: This handler is always run third,
// based on the order defined in the skillBuilder.
// If user has tried the verification code and failed so much that account linking is required.
VoiceCodeVerifier.prototype.CheckIfVoiceCodeVerificationTriesExpired = {
  canHandle(handlerInput) {
    // If accessToken does not exist (ie, account is not linked),
    // then return true, which triggers the "need to link" card.
    // This should not be used unless the skill cannot function without
    // a linked account.  If there's some functionality which is available without
    // linking an account, do this check "just-in-time"
    return maximumVoiceCodeRetiresExceeded(handlerInput);
  },
  handle(handlerInput) {
    const speakOutput = MAX_RETRIES_EXCEEDED;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true) // End session for security purposes
      .withLinkAccountCard()
      .getResponse();
  },
};

VoiceCodeVerifier.prototype.verifyVoiceCode_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'verifyVoiceCode'
    );
  },
  async handle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    const { responseBuilder } = handlerInput;
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    console.log('The User id retrieved is ', sessionAttributes.userId);

    let say = '';
    let slotStatus = '';
    let shouldEndSession = false;
    const slotValues = utils.getSlotValues(request.intent.slots);

    if (sessionAttributes.voiceCodeVerified) {
      console.log('The voice code has already been verified');
      slotStatus = ALREADY_VERIFIED;
    } else if (
      slotValues.voicecode.heardAs
      && slotValues.voicecode.heardAs !== ''
    ) {
      if (
        utils.isEqual(slotValues.voicecode.heardAs, sessionAttributes.voiceCode)
      ) {
        console.log('The voice code is verified');
        sessionAttributes.voiceCodeVerified = true;
        // Update the number of times failed to 0
        sessionAttributes.numberOfTimesVoiceVerificationFailed = 0;
        // Store number of failed attempts
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        // Update the success to DynamoDB
        await changeAlexaVoiceCode(
          sessionAttributes.userId,
          sessionAttributes.alexaVoiceCodeId,
          sessionAttributes.numberOfTimesVoiceVerificationFailed.toString(),
        );
        slotStatus = SESSION_VERIFIED;
      } else {
        console.log('The voice code provided is wrong');
        // Add number of times failed
        sessionAttributes.numberOfTimesVoiceVerificationFailed += 1;
        // Update the failure to DynamoDB
        await changeAlexaVoiceCode(
          sessionAttributes.userId,
          sessionAttributes.alexaVoiceCodeId,
          sessionAttributes.numberOfTimesVoiceVerificationFailed.toString(),
        );
        // Store number of failed attempts
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        sessionAttributes.voiceCodeVerified = false;
        slotStatus = SESSION_NOT_VERIFIED;
        // End the session everytime the verification fails.
        shouldEndSession = true;

        if (sessionAttributes.numberOfTimesVoiceVerificationFailed === 2) {
          slotStatus += LAST_VOICE_CODE_TRY;
        } else if (
          sessionAttributes.numberOfTimesVoiceVerificationFailed >= 3
        ) {
          slotStatus = MAX_RETRIES_EXCEEDED;
        }
      }
    }

    say = slotStatus;

    return responseBuilder
      .speak(say)
      .withShouldEndSession(shouldEndSession) // End session for security purposes
      .getResponse();
  },
};

VoiceCodeVerifier.prototype.lostVoiceCode_Handler = {
  canHandle(handlerInput) {
    const { request } = handlerInput.requestEnvelope;
    return (
      request.type === 'IntentRequest'
      && request.intent.name === 'lostVoiceCode'
    );
  },
  async handle(handlerInput) {
    const { responseBuilder } = handlerInput;

    const say = LOST_VOICE_CODE;

    return responseBuilder
      .speak(say)
      .withShouldEndSession(true) // End session for security purposes
      .getResponse();
  },
};

VoiceCodeVerifier.prototype.getAlexaVoiceCode = async (userId) => {
  console.log('The alexa voice code to retrieve are for ', userId);
  const params = {
    TableName: process.env.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': {
        S: userId,
      },
      ':items': {
        S: 'AlexaVoiceCode#',
      },
    },
    ProjectionExpression: 'failure_rate, voice_code, sk, pk',
  };
  return dbHelper
    .getFromBlitzBudgetTable(params)
    .then((data) => {
      console.log(
        `Successfully retrieved the voice code from the DynamoDB. Item count is ${data.length}`,
      );
      return data;
    })
    .catch((err) => {
      console.log(
        'There was an error getting the voice code from DynamoDB ',
        err,
      );
    });
};

module.exports = new VoiceCodeVerifier();
