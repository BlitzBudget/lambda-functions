const setRecurrenceDates = require('../../../tools/set-recurrence-date');
const constants = require('../../../constants/constant');

describe('setRecurrenceDates: createParameter', () => {
  test('With Data: Success', () => {
    const monthlyDate = new Date();
    const targetDate = new Date();
    setRecurrenceDates.setRecurrenceDates(monthlyDate, constants.MONTHLY);
    expect(monthlyDate.getMonth()).toBe(targetDate.getMonth() + 1);

    const fortNightlyDate = new Date();
    const targetFortNightlyDate = new Date();
    setRecurrenceDates.setRecurrenceDates(fortNightlyDate, constants.BIMONTHLY);
    expect(fortNightlyDate.getDate()).toBe(targetFortNightlyDate.getDate() + 15);

    const weeklyDate = new Date();
    const targetWeeklyDate = new Date();
    setRecurrenceDates.setRecurrenceDates(weeklyDate, constants.WEEKLY);
    expect(weeklyDate.getDate()).toBe(targetWeeklyDate.getDate() + 7);
  });
});
