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
    targetFortNightlyDate.setDate(targetFortNightlyDate.getDate() + 15);
    setRecurrenceDates.setRecurrenceDates(fortNightlyDate, constants.BIMONTHLY);
    expect(fortNightlyDate.getDate()).toBe(targetFortNightlyDate.getDate());

    const weeklyDate = new Date();
    const targetWeeklyDate = new Date();
    targetWeeklyDate.setDate(targetWeeklyDate.getDate() + 7);
    setRecurrenceDates.setRecurrenceDates(weeklyDate, constants.WEEKLY);
    expect(weeklyDate.getDate()).toBe(targetWeeklyDate.getDate());
  });
});
