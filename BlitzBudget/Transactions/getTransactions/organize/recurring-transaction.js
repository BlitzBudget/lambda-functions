const createTransactionSNS = require('../sns/create-transaction');

module.exports.organize = (data, snsEvents, sns) => {
  console.log('data retrieved - RecurringTransactions ', data.Count);
  const today = new Date();
  if (data.Items) {
    data.Items.forEach((recurringTransaction) => {
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
};
