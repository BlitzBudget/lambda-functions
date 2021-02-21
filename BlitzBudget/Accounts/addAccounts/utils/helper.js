const Helper = () => {};

const isEmpty = (obj) => {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj && Object.keys(obj).length !== 0) { return false; }

  return true;
};

Helper.prototype.isEmpty = isEmpty;

Helper.prototype.checkIfRequestEmpty = (
  accountType,
  bankAccountName,
  accountBalance,
  selectedAccount,
  walletId,
) => {
  if (isEmpty(accountType)) {
    console.log(
      'The account type is mandatory for adding an account %j',
      walletId,
    );
    throw new Error(
      'Unable to add the transaction as bank account type is mandatory',
    );
  } else if (isEmpty(bankAccountName)) {
    console.log(
      'The bank account name is mandatory for adding an account %j',
      walletId,
    );
    throw new Error(
      'Unable to add the transaction as bank account name is mandatory',
    );
  } else if (isEmpty(accountBalance)) {
    console.log(
      'The account balance is mandatory for adding an account %j',
      walletId,
    );
    throw new Error(
      'Unable to add the transaction as account balance is mandatory',
    );
  } else if (isEmpty(selectedAccount)) {
    console.log(
      'The selected account is mandatory for adding an account %j',
      walletId,
    );
    throw new Error(
      'Unable to add the transaction as selected account is mandatory',
    );
  }
};

// Export object
module.exports = new Helper();
