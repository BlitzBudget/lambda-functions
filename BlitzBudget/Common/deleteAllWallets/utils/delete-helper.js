var deleteHelper = function () {};

const helper = require('helper');
const deleteItems = require('../delete/items');
const publish = require('../sns/publish');

deleteHelper.prototype.buildParamsForDelete = (result, userId, events) => {
  if (helper.isEmpty(result.Items)) {
    return;
  }

  let params = {};
  params.RequestItems = {};
  params.RequestItems.blitzbudget = [];

  for (let i = 0, len = result.Items.length; i < len; i++) {
    let item = result.Items[i];
    let sk = item['sk'];
    params.RequestItems.blitzbudget[i] = {
      DeleteRequest: {
        Key: {
          pk: userId,
          sk: sk,
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
    function () {
      console.log('successfully deleted the goals');
    },
    function (err) {
      throw new Error('Unable to delete the goals ' + err);
    }
  );
}

deleteHelper.prototype.deleteAllWallets = deleteAllWallets;

// Export object
module.exports = new deleteHelper();
