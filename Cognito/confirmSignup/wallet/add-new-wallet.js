const wallet = () => {};

const util = require('../utils/util');
const walletParameter = require('../create-parameter/wallet');

wallet.prototype.addNewWallet = (userAttributes, currency, DB) => {
  let userId = '';
  for (let i = 0, len = userAttributes.length; i < len; i++) {
    const attribute = userAttributes[i];

    if (util.isEqual(attribute.Name, 'custom:financialPortfolioId')) {
      userId = attribute.Value;
      break;
    }
  }

  const today = new Date();
  const randomValue = `Wallet#${today.toISOString()}`;

  const params = walletParameter.createParameter(userId, randomValue, currency);

  console.log('Adding a new item...');
  return new Promise((resolve, reject) => {
    DB.put(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        resolve({ Wallet: data });
      }
    });
  });
};
