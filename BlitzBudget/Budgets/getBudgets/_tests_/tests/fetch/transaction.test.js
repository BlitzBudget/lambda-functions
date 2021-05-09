const fetchTransaction = require('../../../fetch/transaction');
const mockRequest = require('../../fixtures/request/getBudgets.json');
const mockResponse = require('../../fixtures/response/fetch-date.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Transaction item', () => {
  test('Without Matching Transaction: Success', async () => {
    const response = await fetchTransaction
      .getTransactionsData(mockRequest['body-json'].walletId, '2021-02', '2021-03', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Transaction).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
