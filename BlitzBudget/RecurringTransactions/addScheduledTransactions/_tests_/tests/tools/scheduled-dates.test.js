const scheduledDates = require('../../../tools/scheduled-dates');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');

describe('calculateNextDateToCreates', () => {
  const createTransactionArray = [];

  test('Without Next Date Data: Success', async () => {
    await scheduledDates
      .calculateNextDateToCreates(
        mockRequest,
        createTransactionArray,
      );

    expect(createTransactionArray).not.toBeUndefined();
    expect(createTransactionArray.length).not.toBe(0);
  });
});
