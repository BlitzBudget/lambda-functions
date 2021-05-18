const DeleteVoiceCode = () => {};

/*
 * Delete Old Voice Code
 */
function deleteOldVoiceCode(pk, sk, documentClient) {
  console.log(`Delete old voice code for the primary key ${pk}`);

  function createParameter() {
    return {
      TableName: process.env.TABLE_NAME,
      Key: {
        pk,
        sk,
      },
    };
  }

  const params = createParameter();

  return new Promise((resolve, reject) => {
    documentClient.delete(params, (err, data) => {
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
