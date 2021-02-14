var addHelper = function () {};

const createRecurringTransaction = require('../add/recurring-transaction');
const createTransaction = require('../add/transaction');

/*
 * Add a new recurring transaction if recurrence is required
 */
function addNewRecurringTransaction(event, events, docClient) {
  if (
    isNotEmpty(event['body-json'].recurrence) &&
    event['body-json'].recurrence != 'NEVER'
  ) {
    events.push(
      createRecurringTransaction.addRecurringTransaction(event, docClient)
    );
  }
}

async function addAllItems(events, event, docClient) {
  addNewRecurringTransaction(event, events, docClient);

  events.push(createTransaction.addNewTransaction(event, docClient));

  await Promise.all(events).then(
    function () {
      console.log('successfully saved the new transaction');
    },
    function (err) {
      throw new Error('Unable to add the transactions ' + err);
    }
  );
}

addHelper.prototype.addAllItems = addAllItems;
// Export object
module.exports = new addHelper();
