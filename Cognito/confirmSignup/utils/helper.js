function Helper() {}

const localeToCurrency = require('./locale-to-currency');

const isEmpty = (obj) => {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj
&& Object.keys(obj).length !== 0) { return false; }

  return true;
};

const isNotEmpty = (obj) => !isEmpty(obj);

Helper.prototype.isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

Helper.prototype.isEmpty = isEmpty;

Helper.prototype.isNotEmpty = isNotEmpty;

Helper.prototype.fetchCurrencyInformation = (countryLocale) => {
  /*
   * If chosen currency is empty then revert to Dollars
   */
  let currenyChosen = isEmpty(countryLocale) ? 'US' : countryLocale;
  currenyChosen = localeToCurrency.localeToCurrency[currenyChosen.toUpperCase()];
  console.log('Fetching the country header from cloudfront ', currenyChosen);
  return currenyChosen;
};

Helper.prototype.createLoginParameters = (event) => ({
  AuthFlow: 'USER_PASSWORD_AUTH',
  ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
  AuthParameters: {
    USERNAME: event['body-json'].username,
    PASSWORD: event['body-json'].password,
  },
});

Helper.prototype.createConfirmSignupParameters = (event) => ({
  ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
  ConfirmationCode: event['body-json'].confirmationCode,
  Username: event['body-json'].username,
});

// Export object
module.exports = new Helper();
