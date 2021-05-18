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

describe('constructTransactions With date and Category', () => {
  const createTransactionArray = [];
  const datesMap = {};
  datesMap['2018-02'] = 'Date#2018-02-20T11:03:10.272Z';
  const categoryMap = {};
  categoryMap['2018-02'] = 'Category#2018-02-20T11:03:10.272Z';
  test('With Data: Success', async () => {
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
