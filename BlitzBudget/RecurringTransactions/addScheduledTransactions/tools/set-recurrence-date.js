const constants = require('../constants/constant');

module.exports.setRecurrenceDates = (futureDatesToCreate, recurrence) => {
  // Update recurrence
  switch (recurrence) {
    case constants.MONTHLY:
      futureDatesToCreate.setMonth(futureDatesToCreate.getMonth() + 1);
      break;
    case constants.WEEKLY:
      futureDatesToCreate.setDate(futureDatesToCreate.getDate() + 7);
      break;
    case constants.BIMONTHLY:
      futureDatesToCreate.setDate(futureDatesToCreate.getDate() + 15);
      break;
    default:
      break;
  }
};
