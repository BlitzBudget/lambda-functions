module.exports.organize = (responseData) => {
  responseData.Date.forEach((dateObj) => {
    const date = dateObj;
    date.dateId = dateObj.sk;
    date.walletId = dateObj.pk;
    delete date.sk;
    delete date.pk;
  });
};
