function Helper() {}

const localeToCurrency = require('./locale-to-currency');
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

// Export object
module.exports = new Helper();
