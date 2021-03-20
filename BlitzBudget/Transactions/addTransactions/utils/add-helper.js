const AddHelper = () => {};

const createRecurringTransaction = require('../add/recurring-transaction');
const createTransaction = require('../add/transaction');
const util = require('./util');

/*
 * Add a new recurring transaction if recurrence is required
 */
function addNewRecurringTransaction(event, events, documentClient) {
  if (
    util.isNotEmpty(event['body-json'].recurrence)
    && event['body-json'].recurrence !== 'NEVER'
  ) {
    events.push(
      createRecurringTransaction.addRecurringTransaction(event, documentClient),
    );
  }
}

async function addAllItems(events, event, documentClient) {
  let transactionId;
  addNewRecurringTransaction(event, events, documentClient);

  events.push(createTransaction.addNewTransaction(event, documentClient));

  await Promise.all(events).then(
    (response) => {
      transactionId = response.transactionId;
      console.log('successfully saved the new transaction');
    },
    (err) => {
      throw new Error(`Unable to add the transactions ${err}`);
    },
  );

  return transactionId;
}

AddHelper.prototype.addAllItems = addAllItems;
// Export object
module.exports = new AddHelper();
