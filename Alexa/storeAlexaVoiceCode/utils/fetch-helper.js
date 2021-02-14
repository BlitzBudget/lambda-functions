var fetchHelper = function () {};

const fetchVoiceCode = require('../voice-code/fetch');

/*
 * Check if the new voice code is present
 */
async function handleGetNewVoiceCode(
  userId,
  alexaId,
  voiceCodePresent,
  docClient
) {
  await fetchVoiceCode.getNewVoiceCode(userId, docClient).then(
    function (result) {
      if (result.Count > 0) {
        for (const alexaVoiceCode of result.Items) {
          console.log(
            'successfully assigned the old voice code id ',
            alexaVoiceCode.sk
          );
          alexaId = alexaVoiceCode.sk;
          voiceCodePresent = true;
        }
      }
    },
    function (err) {
      throw new Error('Unable to get a new voice code ' + err);
    }
  );
  return {alexaId, voiceCodePresent};
}

fetchHelper.prototype.handleGetNewVoiceCode = handleGetNewVoiceCode;
// Export object
module.exports = new fetchHelper();
