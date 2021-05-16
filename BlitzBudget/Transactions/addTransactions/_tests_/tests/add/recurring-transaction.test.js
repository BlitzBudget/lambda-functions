const addRecurringTransaction = require('../../../add/recurring-transaction');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');
const mockResponse = require('../../fixtures/response/fetchTransaction.json');

const documentClient = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Add RecurringTransaction item', () => {
  test('With Data: Success', async () => {
    const response = await addRecurringTransaction
      .addRecurringTransaction(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(documentClient.put).toHaveBeenCalledTimes(1);
  });

  test('With Weekly Data: Success', async () => {
    mockRequest['body-json'].recurrence = 'WEEKLY';
    const response = await addRecurringTransaction
      .addRecurringTransaction(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(documentClient.put).toHaveBeenCalledTimes(2);
  });

  test('With Undefined Data: Success', async () => {
    mockRequest['body-json'].recurrence = 'WEEKLYundefined';
    const response = await addRecurringTransaction
      .addRecurringTransaction(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(documentClient.put).toHaveBeenCalledTimes(3);
  });
});
