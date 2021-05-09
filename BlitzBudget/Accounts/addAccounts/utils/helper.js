function Helper() {}

const util = require('./util');

Helper.prototype.checkIfRequestEmpty = (
  accountType,
  bankAccountName,
  accountBalance,
  selectedAccount,
  walletId,
) => {
  if (util.isEmpty(accountType)) {
    console.log('The account type is mandatory for adding an account %j', walletId);
    throw new Error('Unable to add the transaction as bank account type is mandatory');
  } else if (util.isEmpty(bankAccountName)) {
    console.log('The bank account name is mandatory for adding an account %j', walletId);
    throw new Error('Unable to add the transaction as bank account name is mandatory');
  } else if (util.isEmpty(accountBalance)) {
    console.log('The account balance is mandatory for adding an account %j', walletId);
    throw new Error('Unable to add the transaction as account balance is mandatory');
  } else if (util.isEmpty(selectedAccount)) {
    console.log('The selected account is mandatory for adding an account %j', walletId);
    throw new Error('Unable to add the transaction as selected account is mandatory');
  }
};

// Export object
module.exports = new Helper();
