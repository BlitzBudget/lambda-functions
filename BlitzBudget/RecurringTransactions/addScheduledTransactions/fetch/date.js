const FetchDate = () => {};

const constants = require('../constants/constant');

/*
 * Get Date Data
 */
async function getDateData(pk, today, DB) {
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': pk,
      ':items': `Date#${today.substring(0, 4)}-${today.substring(5, 7)}`,
    },
    ProjectionExpression: 'pk, sk',
  };

  // Call DynamoDB to read the item from the table
  const data = await DB.query(params).promise();

  if (data.Count !== 0) {
    return {
      Date: data.Items,
    };
  }

  return {
    dateToCreate: today,
  };
}

FetchDate.prototype.getDateData = getDateData;
// Export object
module.exports = new FetchDate();
