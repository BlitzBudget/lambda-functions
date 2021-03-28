const util = require('./util');
const fetchDate = require('../fetch/date.js');
const addHelper = require('./add-helper');

async function fetchDateIdIfNotProvided(dateMeantFor, event, walletId) {
  let dateId = dateMeantFor;
  let events = [];

  if (util.notIncludesStr(dateMeantFor, 'Date#')) {
    console.log('The date is %j', dateMeantFor);
    const today = new Date(event['body-json'].dateMeantFor);

    await fetchDate.getDateData(walletId, today).then(
      (result) => {
        if (util.isNotEmpty(result.Date)) {
          console.log(
            'successfully assigned the exissting date %j',
            result.Date[0].sk,
          );
          dateId = result.Date[0].sk;
        } else {
          const { date, eventsArray } = addHelper.createANewDate(
            dateMeantFor,
            today,
            event,
          );
          dateId = date;
          events = eventsArray;
        }
      },
      (err) => {
        throw new Error(`Unable to add the Budget ${err}`);
      },
    );
  }
  return { dateId, events };
}

module.exports.calculateAndFetchDate = async (
  dateMeantFor,
  event,
  walletId,
) => {
  const dateId = await fetchDateIdIfNotProvided(dateMeantFor, event, walletId);
  return dateId;
};
