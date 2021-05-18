const FetchVoiceCode = () => {};

/*
 * Get New Voice Code
 */
function getNewVoiceCode(userId, documentClient) {
  function createParameter() {
    return {
      TableName: process.env.TABLE_NAME,
      KeyConditionExpression: 'pk = :userId and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':items': 'AlexaVoiceCode#',
      },
      ProjectionExpression: 'voice_code, sk, pk',
    };
  }

  const params = createParameter();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    documentClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved ', JSON.stringify(data.Items));
        resolve(data);
      }
    });
  });
}

FetchVoiceCode.prototype.getNewVoiceCode = getNewVoiceCode;
// Export object
module.exports = new FetchVoiceCode();
