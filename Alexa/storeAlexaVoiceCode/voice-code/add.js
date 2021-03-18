const AddVoiceCode = () => {};

/*
 * Voice Code
 */
function addNewVoiceCode(event, userId, alexaId, documentClient) {
  const today = new Date().toISOString();

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

  const params = createParameters();

  console.log('Adding a new item...');
  return new Promise((resolve, reject) => {
    documentClient.put(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({
          success: data,
          alexaVoiceCodeId: alexaId,
        });
      }
    });
  });
}

AddVoiceCode.prototype.addNewVoiceCode = addNewVoiceCode;
// Export object
module.exports = new AddVoiceCode();
