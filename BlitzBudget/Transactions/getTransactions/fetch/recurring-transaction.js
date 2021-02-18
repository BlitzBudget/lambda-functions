const RecurringTransaction = () => {};

const createTransactionSNS = require('../sns/create-transaction');

// Get Budget Item
function getRecurringTransactions(walletId, docClient, snsEvents, sns) {
  function createParameters() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :walletId AND begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':walletId': walletId,
        ':items': 'RecurringTransactions#',
      },
      ProjectionExpression:
        'sk, pk, amount, description, category, recurrence, account, next_scheduled, tags, creation_date, category_type, category_name',
    };
  }

  function organizeRecurringTransactionItem(data) {
    console.log('data retrieved - RecurringTransactions ', data.Count);
    const today = new Date();
    Object.keys(data.Items).forEach((recurringTransaction) => {
      const scheduled = new Date(recurringTransaction.next_scheduled);
      if (scheduled < today) {
        snsEvents.push(createTransactionSNS.markTransactionForCreation(recurringTransaction, sns));
      }
      const rt = recurringTransaction;
      rt.recurringTransactionsId = recurringTransaction.sk;
      rt.walletId = recurringTransaction.pk;
      delete rt.sk;
      delete rt.pk;
    });
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        organizeRecurringTransactionItem(data);
        resolve({
          RecurringTransactions: data.Items,
        });
      }
    });
  });
}

RecurringTransaction.prototype.getRecurringTransactions = getRecurringTransactions;
// Export object
module.exports = new RecurringTransaction();
