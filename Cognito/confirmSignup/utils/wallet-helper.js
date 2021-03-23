function WalletHelper() {}

const wallet = require('../wallet/add-new-wallet');
const helper = require('./helper');

async function addNewWallet(
  response,
  doNotCreateANewWallet,
  countryLocale,
  DB,
) {
  const walletResponse = response;

  /*
     * Do not create wallet
     */
  if (doNotCreateANewWallet) {
    return walletResponse;
  }

  /*
     * Get locale to currency
     */
  const currency = helper.fetchCurrencyInformation(countryLocale);

  await wallet.addNewWallet(response.UserAttributes, currency, DB).then(
    (addResponse) => {
      walletResponse.Wallet = addResponse;
    },
    (err) => {
      throw new Error(`Unable to add new wallet${err}`);
    },
  );
  return walletResponse;
}

WalletHelper.prototype.addNewWallet = addNewWallet;
// Export object
module.exports = new WalletHelper();
