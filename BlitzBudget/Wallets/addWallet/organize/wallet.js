const util = require('../utils/util');

module.exports.organize = (event, randomValue) => {
  const response = event;
  if (util.isNotEmpty(response)) {
    response['body-json'].walletId = randomValue;
    response['body-json'].wallet_balance = 0;
    response['body-json'].total_debt_balance = 0;
    response['body-json'].total_asset_balance = 0;
  }

  return response;
};
