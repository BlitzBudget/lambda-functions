function Helper() { }

const util = require('./util');

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { walletId } = event['body-json'];
  const { dateMeantFor } = event['body-json'];
  return {
    walletId,
    dateMeantFor,
  };
};

Helper.prototype.convertToDate = (event) => {
  let year = event['body-json'].dateMeantFor.substring(5, 9);
  let month = event['body-json'].dateMeantFor.substring(10, 12);
  const today = new Date();

  if (util.notIncludesStr(event['body-json'].dateMeantFor, 'Date#')) {
    year = event['body-json'].dateMeantFor.substring(0, 4);
    month = event['body-json'].dateMeantFor.substring(5, 7);
  }

  today.setYear(year);
  today.setMonth(
    parseInt(month, 10) - 1,
  );
  return today;
};

// Export object
module.exports = new Helper();
