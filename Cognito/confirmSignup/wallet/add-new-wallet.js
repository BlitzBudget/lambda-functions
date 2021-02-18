const wallet = () => {};

const helper = require('../utils/helper');

wallet.prototype.addNewWallet = (userAttributes, currency, DB) => {
  let userId = '';
  for (let i = 0, len = userAttributes.length; i < len; i++) {
    const attribute = userAttributes[i];

    if (helper.isEqual(attribute.Name, 'custom:financialPortfolioId')) {
      userId = attribute.Value;
      break;
    }
  }

  const today = new Date();
  const randomValue = `Wallet#${today.toISOString()}`;

  const params = {
    TableName: 'blitzbudget',
    Item: {
      pk: userId,
      sk: randomValue,
      currency,
      wallet_balance: 0,
      total_asset_balance: 0,
      total_debt_balance: 0,
      creation_date: new Date().toISOString(),
      updated_date: new Date().toISOString(),
    },
  };

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
