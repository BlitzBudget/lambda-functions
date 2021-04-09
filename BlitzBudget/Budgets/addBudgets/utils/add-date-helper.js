const addDate = require('../add/date');

module.exports.createANewDate = (today, walletId, documentClient) => {
  const events = [];
  const dateId = `Date#${today.toISOString()}`;
  console.log('Date entry is empty so creating the date object');
  events.push(addDate.createDateItem(walletId, dateId, documentClient));
  return { dateId, events };
};
