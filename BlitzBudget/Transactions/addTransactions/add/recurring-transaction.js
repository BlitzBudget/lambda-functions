function CreateRecurringTransaction() {}

const helper = require('../utils/helper');
const recurringTransactionParameter = require('../create-parameter/recurring-transaction');

async function addRecurringTransaction(event, documentClient) {
  const today = helper.formulateDateFromRequest(event);
  const randomValue = `RecurringTransactions#${today.toISOString()}`;
  const nextRecurrence = today;

  switch (event['body-json'].recurrence) {
    case 'MONTHLY':
      nextRecurrence.setMonth(nextRecurrence.getMonth() + 1);
      break;
    case 'WEEKLY':
      nextRecurrence.setDate(nextRecurrence.getDate() + 7);
      break;
    case 'BI-MONTHLY':
      nextRecurrence.setDate(nextRecurrence.getDate() + 15);
      break;
    default:
      break;
  }

  const createParameterResponse = event;
  createParameterResponse['body-json'].nextScheduled = nextRecurrence.toISOString();
  const params = recurringTransactionParameter.createParameter(createParameterResponse,
    randomValue);

  console.log('Adding a new item...');
  const response = await documentClient.put(params).promise();
  return {
    recurringTransaction: response,
    nextRecurrence: nextRecurrence.toISOString(),
  };
}

CreateRecurringTransaction.prototype.addRecurringTransaction = addRecurringTransaction;
// Export object
module.exports = new CreateRecurringTransaction();
