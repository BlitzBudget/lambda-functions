const organizeRecurringTransaction = require('../../../organize/recurring-transaction');
const mockResponse = require('../../fixtures/response/fetch-recurring-transaction.json');

const sns = {
  publish: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('organizeRecurringTransaction: createParameter', () => {
  test('With Data: Success', () => {
    const snsArray = [];
    organizeRecurringTransaction.organize(mockResponse, snsArray, sns);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).not.toBeUndefined();
    expect(mockResponse.Items[0].walletId).not.toBeUndefined();
    expect(mockResponse.Items[0].recurringTransactionsId).not.toBeUndefined();
    expect(snsArray.length).toBe(1);
    expect(sns.publish).toHaveBeenCalledTimes(1);
  });

  test('Without Data: Success', () => {
    mockResponse.Items = undefined;
    const snsArray = [];
    organizeRecurringTransaction.organize(mockResponse, snsArray, sns);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).toBeUndefined();
    expect(snsArray.length).toBe(0);
  });
});
