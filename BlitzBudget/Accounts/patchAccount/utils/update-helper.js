const updateBankAccount = require('../update/bank-account');
const util = require('./util');
const convertAccountKey = require('../convert/account-keys');

module.exports.updateBankAccountToUnselected = (result, documentClient) => {
  const events = [];
  const bankAccounts = result.Account;

  if (util.isNotEmpty(bankAccounts)) {
    bankAccounts.forEach((account) => {
      if (account.selected_account) {
        console.log('The account %j is being unselected', account.sk);
        const updateItem = convertAccountKey.convertAccountKeys(account);
        events.push(updateBankAccount.updatingBankAccounts(updateItem, documentClient));
      }
    });
  } else {
    console.log('There are no bank accounts to unselect');
  }

  return events;
};
