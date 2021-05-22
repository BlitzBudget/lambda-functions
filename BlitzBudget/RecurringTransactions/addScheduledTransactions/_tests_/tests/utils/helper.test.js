const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');

describe('extractVariablesFromRequest', () => {
  const events = mockRequest;
  test('With Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequest(events);

    expect(response.category).not.toBeUndefined();
    expect(response.walletId).not.toBeUndefined();
    expect(response.categoryName).not.toBeUndefined();
    expect(response.categoryType).not.toBeUndefined();
    expect(response.recurringTransactionsId).not.toBeUndefined();
  });
});

describe('extractVariablesFromRequestForTransaction', () => {
  const events = mockRequest;
  test('With Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequestForTransaction(events);

    expect(response.futureDateToCreate).not.toBeUndefined();
    expect(response.walletId).not.toBeUndefined();
    expect(response.tags).not.toBeUndefined();
    expect(response.account).not.toBeUndefined();
    expect(response.amount).not.toBeUndefined();
    expect(response.description).not.toBeUndefined();
    expect(response.recurrence).not.toBeUndefined();
    expect(response.today).not.toBeUndefined();
  });
});

describe('convertToDate', () => {
  test('With Data: Success', async () => {
    const date = await helper
      .convertToDate({
        dateToCreate: '2021-05',
      });

    expect(date.getFullYear()).toBe(2021);
    expect(date.getMonth()).toBe(4);
  });
});
