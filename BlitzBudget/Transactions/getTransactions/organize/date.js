const util = require('../utils/util');

module.exports.organize = (responseData) => {
  if (util.isEmpty(responseData.Date)) {
    return;
  }

  responseData.Date.forEach((dateObj) => {
    const date = dateObj;
    date.dateId = dateObj.sk;
    date.walletId = dateObj.pk;
    delete date.sk;
    delete date.pk;
  });
};
