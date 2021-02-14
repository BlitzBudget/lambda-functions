var deleteVoiceCode = function () {};

/*
 * Delete Old Voice Code
 */
function deleteOldVoiceCode(pk, sk, docClient) {
  console.log('Delete old voice code for the primary key ' + pk);

  var params = createParameters();

  return new Promise((resolve, reject) => {
    docClient.delete(params, function (err, data) {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({
          success: data,
        });
      }
    });
  });

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      Key: {
        pk: pk,
        sk: sk,
      },
    };
  }
}

deleteVoiceCode.prototype.deleteOldVoiceCode = deleteOldVoiceCode;
// Export object
module.exports = new deleteVoiceCode();
