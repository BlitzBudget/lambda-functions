module.exports.organize = (data) => {
  console.log('data retrieved - Category %j', data.Count);
  if (data.Items) {
    data.Items.forEach((dateObj) => {
      const date = dateObj;
      date.dateId = dateObj.sk;
      date.walletId = dateObj.pk;
      delete date.sk;
      delete date.pk;
    });
  }
};
