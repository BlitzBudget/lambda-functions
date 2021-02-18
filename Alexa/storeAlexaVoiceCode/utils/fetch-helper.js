const FetchHelper = () => {};

const fetchVoiceCode = require('../voice-code/fetch');

/*
 * Check if the new voice code is present
 */
async function handleGetNewVoiceCode(
  userId,
  docClient,
) {
  let alexaId;
  let voiceCodePresent;
  await fetchVoiceCode.getNewVoiceCode(userId, docClient).then(
    (result) => {
      if (result.Count > 0) {
        Object.keys(result.Items).forEach((alexaVoiceCode) => {
          console.log(
            'successfully assigned the old voice code id ',
            alexaVoiceCode.sk,
          );
          alexaId = alexaVoiceCode.sk;
          voiceCodePresent = true;
        });
      }
    },
    (err) => {
      throw new Error(`Unable to get a new voice code ${err}`);
    },
  );
  return { alexaId, voiceCodePresent };
}

FetchHelper.prototype.handleGetNewVoiceCode = handleGetNewVoiceCode;
// Export object
module.exports = new FetchHelper();
