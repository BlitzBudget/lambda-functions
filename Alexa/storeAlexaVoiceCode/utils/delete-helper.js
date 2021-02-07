var deletHelper = function () { };

const deleteVoiceCode = require('../voice-code/delete');

/*
* Delete the old voice code
*/
async function handleDeleteOldVoiceCode(userId, alexaId, docClient) {
    await deleteVoiceCode.deleteOldVoiceCode(userId, alexaId, docClient).then(function () {
        console.log("successfully added the old voice code");
    }, function (err) {
        throw new Error("Unable to delete the old voice code " + err);
    });
}


deletHelper.prototype.handleDeleteOldVoiceCode = handleDeleteOldVoiceCode;
// Export object
module.exports = new deletHelper();