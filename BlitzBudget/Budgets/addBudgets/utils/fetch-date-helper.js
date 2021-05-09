const fetchDate = require('../fetch/date.js');

module.exports.fetchDateData = async (walletId, today, documentClient) => {
  let dateResponse;
  await fetchDate.getDateData(walletId, today, documentClient).then(
    (result) => {
      dateResponse = result;
    },
    (err) => {
      throw new Error(`Unable to add the Budget ${err}`);
    },
  );
  return dateResponse;
};
