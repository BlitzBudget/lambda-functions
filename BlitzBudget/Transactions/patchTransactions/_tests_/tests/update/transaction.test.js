const updateTransaction = require('../../../update/transaction');
const mockRequest = require('../../fixtures/request/patchTransactions.json');
const mockResponse = require('../../fixtures/response/fetchTransaction.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Update Transaction item', () => {
  test('Without Matching Budget: Success', async () => {
    const response = await updateTransaction
      .updatingTransactions(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
