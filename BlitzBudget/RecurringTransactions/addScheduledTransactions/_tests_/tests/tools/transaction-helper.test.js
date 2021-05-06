const transactionHelper = require('../../../tools/transaction-helper');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');

describe('constructTransactions', () => {
  const createTransactionArray = [];
  const datesMap = {};
  const categoryMap = {};
  test('Without User ID Data: Success', async () => {
    await transactionHelper
      .constructTransactions(
        datesMap,
        categoryMap,
        mockRequest,
        createTransactionArray,
      );

    expect(createTransactionArray).not.toBeUndefined();
    expect(createTransactionArray.length).not.toBe(0);
  });
});
