const DeleteVoiceCode = () => {};

/*
 * Delete Old Voice Code
 */
function deleteOldVoiceCode(pk, sk, docClient) {
  console.log(`Delete old voice code for the primary key ${pk}`);

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      Key: {
        pk,
        sk,
      },
    };
  }

  const params = createParameters();

  return new Promise((resolve, reject) => {
    docClient.delete(params, (err, data) => {
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
}

DeleteVoiceCode.prototype.deleteOldVoiceCode = deleteOldVoiceCode;
// Export object
module.exports = new DeleteVoiceCode();
