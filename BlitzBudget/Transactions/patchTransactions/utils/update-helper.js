const UpdateHelper = () => {};

const updateTransaction = require('../update/transaction');

async function updateAllItems(events, event, docClient) {
  let updateResponse;
  events.push(updateTransaction.updatingTransactions(event, docClient));
  await Promise.all(events).then(
    (response) => {
      updateResponse = response;
      console.log('successfully saved the new transactions');
    },
    (err) => {
      throw new Error(`Unable to add the transactions ${err}`);
    },
  );
  return updateResponse;
}

UpdateHelper.prototype.updateAllItems = updateAllItems;
// Export object
module.exports = new UpdateHelper();
