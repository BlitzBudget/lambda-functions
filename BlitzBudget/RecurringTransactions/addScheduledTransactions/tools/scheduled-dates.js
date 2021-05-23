function ScheduledDate() {}

const util = require('../utils/util');
const setRecurrenceDates = require('./set-recurrence-date');

function calculateDatesToCreate(nextDateToCreate, today, datesToCreateTransactions, recurrence) {
  while (nextDateToCreate < today) {
    console.log('The scheduled date is %j', nextDateToCreate);

    /*
     * Scheduled Transactions
     */
    const nextDateToCreateAsString = `${nextDateToCreate.getFullYear()
    }-${
      (`0${nextDateToCreate.getMonth() + 1}`).slice(-2)}`;

    if (
      util.notIncludesStr(
        datesToCreateTransactions,
        nextDateToCreateAsString,
      )
    ) {
      datesToCreateTransactions.push(nextDateToCreateAsString);
    }

    setRecurrenceDates.setRecurrenceDates(nextDateToCreate, recurrence);
  }
}

/*
 * Build params for put items (transactions)
 */
function calculateNextDateToCreates(
  event,
  datesToCreateTransactions,
) {
  let futureCreationDateForRecurringTransaction;
  if (util.isEmpty(event.Records[0])) {
    return futureCreationDateForRecurringTransaction;
  }

  const nextScheduled = event.Records[0].Sns.MessageAttributes.next_scheduled.Value;
  const recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
  const nextDateToCreate = new Date(nextScheduled);
  const today = new Date();

  calculateDatesToCreate(nextDateToCreate, today, datesToCreateTransactions, recurrence);
  console.log(
    ' The dates to create are %j',
    datesToCreateTransactions.toString(),
  );

  /*
   * Set the next date field for recurring transaction
   */
  futureCreationDateForRecurringTransaction = nextDateToCreate.toISOString();
  return futureCreationDateForRecurringTransaction;
}

ScheduledDate.prototype.calculateNextDateToCreates = calculateNextDateToCreates;
// Export object
module.exports = new ScheduledDate();
