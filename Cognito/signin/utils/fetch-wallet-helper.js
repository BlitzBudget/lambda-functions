const fetchWallet = require('../fetch/wallet');
const util = require('./util');

// Fetch Wallets
async function fetchWalletFromUser(response, docClient) {
  const userIdParam = util.fetchUserId(response);
  await fetchWallet.getWallet(userIdParam, docClient).then(
    (result) => {
      response.Wallet = result;
      console.log(`Logged in the user ${JSON.stringify(result)}`);
    },
    (err) => {
      throw new Error(`Unable to get the wallet at the moment  ${err}`);
    },
  );
  return response;
}

module.exports.fetchWalletFromUser = fetchWalletFromUser;
