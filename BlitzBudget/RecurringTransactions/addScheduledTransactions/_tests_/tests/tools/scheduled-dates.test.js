const scheduledDates = require('../../../tools/scheduled-dates');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');

describe('calculateNextDateToCreates', () => {
  const createTransactionArray = [];

  test('Without Next Date Data: Success', async () => {
    const futureCreationDateForRecurringTransaction = await scheduledDates
      .calculateNextDateToCreates(
        mockRequest,
        createTransactionArray,
      );

    expect(futureCreationDateForRecurringTransaction).not.toBeUndefined();
    expect(createTransactionArray).not.toBeUndefined();
    expect(createTransactionArray.length).not.toBe(0);
  });

  test('Without Records Data: Success', async () => {
    const eventsWithoutRecord = {
      Records: [],
    };
    const futureCreationDateForRecurringTransaction = await scheduledDates
      .calculateNextDateToCreates(
        eventsWithoutRecord,
        createTransactionArray,
      );

    expect(futureCreationDateForRecurringTransaction).toBeUndefined();
  });
});
