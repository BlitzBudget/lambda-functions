var addVoiceCode = function () {};

/*
 * Voice Code
 */
function addNewVoiceCode(event, userId, alexaId, docClient) {
  let today = new Date().toISOString();

  var params = createParameters();

  console.log('Adding a new item...');
  return new Promise((resolve, reject) => {
    docClient.put(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({
          success: data,
        });
        event['body-json'].alexaVoiceCodeId = alexaId;
      }
    });
  });

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      Item: {
        pk: userId,
        sk: alexaId,
        voice_code: event['body-json'].voiceCode,
        failure_rate: 0,
        creation_date: today,
        updated_date: today,
      },
    };
  }
}

addVoiceCode.prototype.addNewVoiceCode = addNewVoiceCode;
// Export object
module.exports = new addVoiceCode();
