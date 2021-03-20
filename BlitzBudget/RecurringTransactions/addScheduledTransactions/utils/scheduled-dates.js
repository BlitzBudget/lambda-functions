const ScheduledDate = () => {};

const helper = require('./helper');

/*
 * Build params for put items (transactions)
 */
function calculateNextDateToCreates(
  event,
  datesToCreateTransactions,
) {
  let futureCreationDate;
  if (util.isEmpty(event.Records[0])) {
    return futureCreationDate;
  }

  const nextScheduled = event.Records[0].Sns.MessageAttributes.next_scheduled.Value;
  const recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
  let nextDateToCreate = new Date(nextScheduled);
  const today = new Date();

  function calculateDatesToCreate() {
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

      // Update recurrence
      switch (recurrence) {
        case 'MONTHLY':
          nextDateToCreate.setMonth(nextDateToCreate.getMonth() + 1);
          break;
        case 'WEEKLY':
          nextDateToCreate.setDate(nextDateToCreate.getDate() + 7);
          break;
        case 'BI-MONTHLY':
          nextDateToCreate.setDate(nextDateToCreate.getDate() + 15);
          break;
        default:
          nextDateToCreate = new Date();
          break;
      }
    }
  }

  calculateDatesToCreate();

  console.log(
    ' The dates to create are %j',
    datesToCreateTransactions.toString(),
  );

  /*
   * Set the next date field for recurring transaction
   */
  futureCreationDate = nextDateToCreate.toISOString();
  return futureCreationDate;
}

ScheduledDate.prototype.calculateNextDateToCreates = calculateNextDateToCreates;
// Export object
module.exports = new ScheduledDate();
