const Helper = () => {};

const util = require('./util');

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { walletId } = event['body-json'];
  const { dateMeantFor } = event['body-json'];
  return {
    walletId,
    dateMeantFor,
  };
};

/*
 * If dateMeantFor, category, planned is empty
 */
Helper.prototype.throwErrorIfEmpty = (event, walletId) => {
  if (util.isEmpty(event['body-json'].dateMeantFor)) {
    console.log('The date is mandatory for adding an account %j', walletId);
    throw new Error('Unable to add the transaction as date is mandatory');
  } else if (util.isEmpty(event['body-json'].category)) {
    console.log('The category is mandatory for adding an account %j', walletId);
    throw new Error('Unable to add the transaction as category is mandatory');
  } else if (util.isEmpty(event['body-json'].planned)) {
    console.log(
      'The planned balance is mandatory for adding an account %j',
      walletId,
    );
    throw new Error(
      'Unable to add the transaction as planned balance is mandatory',
    );
  }
};

Helper.prototype.convertToDate = (event) => {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  return today;
};

// Export object
module.exports = new Helper();
