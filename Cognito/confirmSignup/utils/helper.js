var helper = function () {};

let isNotEmpty = (obj) => {
  return !isEmpty(obj);
};

let isEmpty = (obj) => {
  // Check if objext is a number or a boolean
  if (typeof obj == 'number' || typeof obj == 'boolean') return false;

  // Check if obj is null or undefined
  if (obj == null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length != 'undefined') return obj.length == 0;

  // check if obj is a custom obj
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

  return true;
};

helper.prototype.isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

helper.prototype.isEmpty = isEmpty;

helper.prototype.isNotEmpty = isNotEmpty;

helper.prototype.fetchCurrencyInformation = (countryLocale) => {
  let currenyChosen = localeToCurrency.localeToCurrency[countryLocale];
  /*
   * If chosen currency is empty then revert to Dollars
   */
  currenyChosen = helper.isEmpty(currenyChosen) ? '$' : currenyChosen;
  console.log('Fetching the country header from cloudfront ', currenyChosen);
  return currenyChosen;
};

helper.prototype.createLoginParameters = (event) => {
  return {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
    AuthParameters: {
      USERNAME: event['body-json'].username,
      PASSWORD: event['body-json'].password,
    },
  };
};

helper.prototype.createConfirmSignupParameters = (event) => {
  return {
    ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
    ConfirmationCode: event['body-json'].confirmationCode,
    Username: event['body-json'].username,
  };
};

// Export object
module.exports = new helper();
