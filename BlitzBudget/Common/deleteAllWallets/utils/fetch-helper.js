const FetchHelper = () => {};

const deleteHelper = require('./delete-helper');
const constants = require('../constants/constant');

// Get goal Item
function getAllItems(userId, DB) {
  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :userId',
    ExpressionAttributeValues: {
      ':userId': userId,
    },
    ProjectionExpression: 'sk',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    DB.query(params, (err, data) => {
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

async function fetchAllItemsToDelete(userId, sns, DB, events) {
  let paramsForDelete;
  await getAllItems(userId, DB).then(
    (result) => {
      console.log('successfully fetched all the wallets ', result);
      paramsForDelete = deleteHelper.buildParamsForDelete(
        result,
        userId,
        sns,
        events,
      );
    },
    (err) => {
      throw new Error(`Unable to delete the goals ${err}`);
    },
  );
  return paramsForDelete;
}

FetchHelper.prototype.fetchAllItemsToDelete = fetchAllItemsToDelete;

// Export object
module.exports = new FetchHelper();
