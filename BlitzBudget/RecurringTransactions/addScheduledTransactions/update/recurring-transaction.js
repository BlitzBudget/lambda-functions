const RecurringTransaction = () => {};

const constants = require('../constants/constant');

/*
 * Update the recurring transaction
 */
async function updateRecurringTransactionsData(
  walletId,
  sk,
  futureTransactionCreationDate,
  DB,
) {
  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
      Key: {
        pk: walletId,
        sk,
      },
      UpdateExpression: 'set next_scheduled = :ns, updated_date = :u',
      ExpressionAttributeValues: {
        ':ns': futureTransactionCreationDate,
        ':u': new Date().toISOString(),
      },
      ReturnValues: 'ALL_NEW',
    };
  }

  const params = createParameters();

  console.log('Adding a new item...');
  const response = await DB.update(params).promise();
  return response.Attributes;
}

RecurringTransaction.prototype.updateRecurringTransactionsData = updateRecurringTransactionsData;
// Export object
module.exports = new RecurringTransaction();
