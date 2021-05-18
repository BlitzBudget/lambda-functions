function UpdateHelper() {}

const updateTransaction = require('../update/transaction');
const util = require('./util');

async function updateAllItems(events, event, documentClient) {
  const updateResponse = {};
  events.push(updateTransaction.updatingTransactions(event, documentClient));
  await Promise.all(events).then(
    (response) => {
      response.forEach((aResponse) => {
        if (util.isNotEmpty(aResponse.Transaction)) {
          updateResponse.Transaction = aResponse.Transaction;
        } else if (util.isNotEmpty(aResponse.Category)) {
          updateResponse.Category = aResponse.Category;
        }
      });
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
