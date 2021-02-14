var addHelper = function () {};

const addVoiceCode = require('../voice-code/add');

/*
 * Add a new voice code
 */
async function handleAddNewVoiceCode(event, userId, alexaId, docClient) {
  await addVoiceCode.addNewVoiceCode(event, userId, alexaId, docClient).then(
    function () {
      console.log('successfully added a new voice code');
    },
    function (err) {
      throw new Error('Unable to add a new voice code ' + err);
    }
  );
}

addHelper.prototype.handleAddNewVoiceCode = handleAddNewVoiceCode;
// Export object
module.exports = new addHelper();
