const AddHelper = () => {};

const createRecurringTransaction = require('../add/recurring-transaction');
const createTransaction = require('../add/transaction');
const helper = require('./helper');

/*
 * Add a new recurring transaction if recurrence is required
 */
function addNewRecurringTransaction(event, events, docClient) {
  if (
    helper.isNotEmpty(event['body-json'].recurrence)
    && event['body-json'].recurrence !== 'NEVER'
  ) {
    events.push(
      createRecurringTransaction.addRecurringTransaction(event, docClient),
    );
  }
}

async function addAllItems(events, event, docClient) {
  let transactionId;
  addNewRecurringTransaction(event, events, docClient);

  events.push(createTransaction.addNewTransaction(event, docClient));

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
