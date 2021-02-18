const DeleteHelper = () => {};

const deleteVoiceCode = require('../voice-code/delete');

/*
 * Delete the old voice code
 */
async function handleDeleteOldVoiceCode(userId, alexaId, docClient) {
  await deleteVoiceCode.deleteOldVoiceCode(userId, alexaId, docClient).then(
    () => {
      console.log('successfully added the old voice code');
    },
    (err) => {
      throw new Error(`Unable to delete the old voice code ${err}`);
    },
  );
}

DeleteHelper.prototype.handleDeleteOldVoiceCode = handleDeleteOldVoiceCode;
// Export object
module.exports = new DeleteHelper();
