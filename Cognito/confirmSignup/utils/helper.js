function Helper() {}

const localeToCurrency = require('../constants/locale-to-currency');
const constants = require('../constants/constant');
const util = require('./util');

Helper.prototype.fetchCurrencyInformation = (countryLocale) => {
  /*
   * If chosen currency is empty then revert to Dollars
   */
  let currenyChosen = util.isEmpty(countryLocale) ? 'US' : countryLocale;
  currenyChosen = localeToCurrency.localeToCurrency[currenyChosen.toUpperCase()];
  console.log('Fetching the country header from cloudfront ', currenyChosen);
  return currenyChosen;
};

Helper.prototype.fetchUserId = (userAttributes) => {
  let userId;
  for (let i = 0, len = userAttributes.length; i < len; i++) {
    const attribute = userAttributes[i];

    if (util.isEqual(attribute.Name, constants.FINANCIAL_PORTFOLIO_ID)) {
      userId = attribute.Value;
      break;
    }
  }
  return userId;
};

// Export object
module.exports = new Helper();
