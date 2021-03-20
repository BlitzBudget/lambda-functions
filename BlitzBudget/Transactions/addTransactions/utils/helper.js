const Helper = () => {};

const util = require('./util');

/*
 * If Account, Category, Amount or Date is empty
 */
function throwErrorIfEmpty(event, walletId) {
  if (util.isEmpty(event['body-json'].account)) {
    console.log(
      'The bank account is mandatory for adding a transaction %j',
      walletId,
    );
    throw new Error(
      'Unable to add the transaction as bank account is mandatory',
    );
  } else if (util.isEmpty(event['body-json'].category)) {
    console.log(
      'The category is mandatory for adding a transaction %j',
      walletId,
    );
    throw new Error('Unable to add the transaction as category is mandatory');
  } else if (util.isEmpty(event['body-json'].amount)) {
    console.log(
      'The amount is mandatory for adding a transaction %j',
      walletId,
    );
    throw new Error('Unable to add the transaction as amount is mandatory');
  } else if (util.isEmpty(event['body-json'].dateMeantFor)) {
    console.log('The date is mandatory for adding a transaction %j', walletId);
    throw new Error('Unable to add the transaction as date is mandatory');
  }
}

Helper.prototype.throwErrorIfEmpty = throwErrorIfEmpty;

// Export object
module.exports = new Helper();
