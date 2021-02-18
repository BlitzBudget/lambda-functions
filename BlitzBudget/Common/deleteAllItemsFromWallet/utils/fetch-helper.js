const FetchHelper = () => {};

// Get all Items
function getAllItems(walletId, DB) {
  const params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :walletId',
    ExpressionAttributeValues: {
      ':walletId': walletId,
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
