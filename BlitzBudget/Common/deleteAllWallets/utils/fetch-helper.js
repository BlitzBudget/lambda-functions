function FetchHelper() {}

const deleteHelper = require('./delete-helper');
const snsHelper = require('./sns-helper');
const fetchParameter = require('../create-parameter/fetch');

// Get goal Item
async function getAllItems(userId, DB) {
  const params = fetchParameter.createParameter(userId);

  // Call DynamoDB to read the item from the table
  const response = await DB.query(params).promise();
  return response;
}

async function fetchAllItemsToDelete(userId, sns, DB, events) {
  let response;

  await getAllItems(userId, DB).then(
    (result) => {
      console.log('successfully fetched all the wallets ', result);
      response = result;
    },
    (err) => {
      throw new Error(`Unable to delete the goals ${err}`);
    },
  );

  const paramsForDelete = deleteHelper.buildParamsForDelete(
    response,
    userId,
    sns,
    events,
  );

  snsHelper.publishToSNS(response, sns, events);

  return paramsForDelete;
}

FetchHelper.prototype.fetchAllItemsToDelete = fetchAllItemsToDelete;

// Export object
module.exports = new FetchHelper();
