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
});
