const AddHelper = () => {};

const addVoiceCode = require('../voice-code/add');

/*
 * Add a new voice code
 */
async function handleAddNewVoiceCode(event, userId, alexaId, documentClient) {
  let alexaVoiceCodeId;
  await addVoiceCode.addNewVoiceCode(event, userId, alexaId, documentClient).then(
    (response) => {
      alexaVoiceCodeId = response.alexaVoiceCodeId;
      console.log('successfully added a new voice code');
    },
    (err) => {
      throw new Error(`Unable to add a new voice code ${err}`);
    },
  );

  return alexaVoiceCodeId;
}

AddHelper.prototype.handleAddNewVoiceCode = handleAddNewVoiceCode;
// Export object
module.exports = new AddHelper();
