const FetchHelper = () => {};

const fetchParameter = require('../create-parameter/fetch');

// Get all Items
async function getAllItems(walletId, DB) {
  const params = fetchParameter.createParameter(walletId);

  // Call DynamoDB to read the item from the table
  const response = await DB.query(params).promise();
  return response;
}

async function fetchAllItemsForWallet(walletId, DB) {
  let result;
  await getAllItems(walletId, DB).then(
    (res) => {
      console.log('successfully fetched all the items ', res);
      result = res;
    },
    (err) => {
      throw new Error(`Unable to delete the goals ${err}`);
    },
  );
  return result;
}

FetchHelper.prototype.fetchAllItemsForWallet = fetchAllItemsForWallet;

// Export object
module.exports = new FetchHelper();
