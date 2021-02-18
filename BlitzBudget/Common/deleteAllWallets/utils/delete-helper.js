const DeleteHelper = () => {};

const helper = require('./helper');
const deleteItems = require('../delete/items');
const publish = require('../sns/publish');

DeleteHelper.prototype.buildParamsForDelete = (result, userId, sns, events) => {
  if (helper.isEmpty(result.Items)) {
    return undefined;
  }

  const params = {};
  params.RequestItems = {};
  params.RequestItems.blitzbudget = [];

  for (let i = 0, len = result.Items.length; i < len; i++) {
    const item = result.Items[i];
    const { sk } = item;
    params.RequestItems.blitzbudget[i] = {
      DeleteRequest: {
        Key: {
          pk: userId,
          sk,
        },
      },
    };

    // If wallet item  then push to SNS
    if (helper.includesStr(sk, 'Wallet#')) {
      events.push(publish.publishToResetAccountsSNS(sk, sns));
    }
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
