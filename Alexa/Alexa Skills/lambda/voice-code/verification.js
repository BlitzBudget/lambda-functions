var voiceCodeVerifier = function () { };
// Setup ================================================================================

const utils = require('../helper/utils');

// Constants ============================================================================

const MAX_RETRIES_ALLOWED = 3;
const ALREADY_VERIFIED = 'You are already a verified user!';
const SESSION_NOT_VERIFIED = 'The voice code provided was wrong! Please try again';
const LOST_VOICE_CODE = 'Sorry to hear that! You could disable the blitzbudget skill in Alexa and then re-enable it again.';
const LAST_VOICE_CODE_TRY = ' This is your last try, <break time="0.10s"/> after which you would be signed out of your account for security purposes!';
const SESSION_VERIFIED = '<amazon:emotion name="excited" intensity="low">Great! You session has been successfully verified. </amazon:emotion> How can I help you today?';
const VERIFY_VOICE_CODE = '<amazon:emotion name="disappointed" intensity="medium"> You need to verify your voice code. </amazon:emotion> Verify by saying <break time="0.20s"/> "Verify Blitz Budget " followed by your four digit voice code';
const MAX_RETRIES_EXCEEDED = '<amazon:emotion name="disappointed" intensity="medium"> You have exceeded the maximum number of voice code verification tries.</amazon:emotion>  <break time="0.20s"/> Please disable and then re-enable the blitz budget skill, to reset your voice code';

// CheckVoiceCodeVerifiedHandler: This handler is always run second,
// based on the order defined in the skillBuilder.
// If verification code is not set, then request it from the user.
voiceCodeVerifier.prototype.CheckVoiceCodeVerifiedHandler = {
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

// CheckIfVoiceCodeVerificationTriesExpired: This handler is always run third,
// based on the order defined in the skillBuilder.
// If user has tried the verification code and failed so much that account linking is required.
voiceCodeVerifier.prototype.CheckIfVoiceCodeVerificationTriesExpired = {
  canHandle(handlerInput) {
    // If accessToken does not exist (ie, account is not linked),
    // then return true, which triggers the "need to link" card.
    // This should not be used unless the skill cannot function without
    // a linked account.  If there's some functionality which is available without
    // linking an account, do this check "just-in-time"
    return maximumVoiceCodeRetiresExceeded(handlerInput);
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = MAX_RETRIES_EXCEEDED;
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withLinkAccountCard()
      .getResponse();
  },
};

voiceCodeVerifier.prototype.verifyVoiceCode_Handler = {
    canHandle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        return request.type === 'IntentRequest' && request.intent.name === 'verifyVoiceCode' ;
    },
    async handle(handlerInput) {
        const request = handlerInput.requestEnvelope.request;
        const responseBuilder = handlerInput.responseBuilder;
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        console.log('The User id retrieved is ', sessionAttributes.userId);

        let say = '';
        let slotStatus = '';
        let shouldEndSession = true;

        let slotValues = utils.getSlotValues(request.intent.slots); 
        
        if(sessionAttributes.voiceCodeVerified) {
            slotStatus = ALREADY_VERIFIED;
        } else if (slotValues.voicecode.heardAs && slotValues.voicecode.heardAs !== '') {
            if(utils.isEqual(slotValues.voicecode.heardAs, sessionAttributes.voiceCode)) {
                sessionAttributes.voiceCodeVerified = true;
                // Update the number of times failed to 0
                sessionAttributes.numberOfTimesVoiceVerificationFailed = 0;
                // Store number of failed attempts
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                // Update the success to DynamoDB 
                // TODO
                slotStatus = SESSION_VERIFIED;
            } else {
                // Add number of times failed
                sessionAttributes.numberOfTimesVoiceVerificationFailed++;
                // Update the failure to DynamoDB 
                // TODO
                // Store number of failed attempts
                handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
                sessionAttributes.voiceCodeVerified = false;
                slotStatus = SESSION_NOT_VERIFIED;
                
                if(sessionAttributes.numberOfTimesVoiceVerificationFailed == 2) {
                    slotStatus += LAST_VOICE_CODE_TRY;
                }
            }
        }
        
        say = slotStatus;
        
        return responseBuilder
            .speak(say)
            .withShouldEndSession(shouldEndSession) // End session for security purposes
            .getResponse();
        
    }
}

voiceCodeVerifier.prototype.lostVoiceCode_Handler =  {
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
            .withShouldEndSession(true) // End session for security purposes
            .getResponse();
        
    }
}

/*
* Check if voice code is verified
* If voice code is empty -- It needs verification
*/
function checkIfVoiceCodeRequired(handlerInput) {
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    return sessionAttributes.voiceCodeVerified;
}

/*
* Check if Maximum Voice Code Retries have exceeded
*/
function maximumVoiceCodeRetiresExceeded(handlerInput) {
    // Number of times voice verification has failed.
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    const numberOfTimesVoiceVerificationFailed  = sessionAttributes.numberOfTimesVoiceVerificationFailed;    
    return  utils.isNotEmpty(numberOfTimesVoiceVerificationFailed) && numberOfTimesVoiceVerificationFailed >= MAX_RETRIES_ALLOWED;
}


module.exports = new voiceCodeVerifier();