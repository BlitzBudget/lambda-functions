const updateBankAccount = require('../update/bank-account');
const util = require('./util');

module.exports.updateBankAccountToUnselected = (result, events, documentClient) => {
  const bankAccounts = result.Account;
  if (util.isNotEmpty(bankAccounts)) {
    Object.keys(bankAccounts).forEach((account) => {
      if (account.selected_account) {
        console.log('The account %j is being unselected', account.sk);
        const updateItem = {};
        updateItem['body-json'] = {};
        updateItem['body-json'].selectedAccount = false;
        updateItem['body-json'].walletId = account.pk;
        updateItem['body-json'].accountId = account.sk;
        events.push(updateBankAccount.updatingBankAccounts(updateItem, documentClient));
      }
    });
  } else {
    console.log('There are no bank accounts to unselect');
  }
};
