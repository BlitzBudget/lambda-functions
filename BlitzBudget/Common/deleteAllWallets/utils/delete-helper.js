function DeleteHelper() {}

const util = require('./util');
const deleteItems = require('../delete/items');
const deleteParameter = require('../create-parameter/delete');
const deleteRequestParameter = require('../create-parameter/delete-request');

DeleteHelper.prototype.buildParamsForDelete = (result, userId) => {
  if (util.isEmpty(result.Items)) {
    return undefined;
  }

  const params = deleteParameter.createParameter();

  for (let i = 0, len = result.Items.length; i < len; i++) {
    const item = result.Items[i];
    const { sk } = item;
    params.RequestItems.blitzbudget[i] = deleteRequestParameter.createParameter(userId, sk);
  }

  return params;
};

async function deleteAllWallets(deleteParams, DB, events) {
  events.push(deleteItems.deleteItems(deleteParams, DB));
  await Promise.all(events).then(
    () => {
      console.log('successfully deleted the goals');
    },
    (err) => {
      throw new Error(`Unable to delete the goals ${err}`);
    },
  );
}

DeleteHelper.prototype.deleteAllWallets = deleteAllWallets;

// Export object
module.exports = new DeleteHelper();
