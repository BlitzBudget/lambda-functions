const fetchBudget = require('../../../fetch/budget');
const mockRequest = require('../../fixtures/request/getTransactions.json');
const mockResponse = require('../../fixtures/response/fetchBudget.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Budget item', () => {
  test('Without Matching Budget: Success', async () => {
    const response = await fetchBudget
      .getBudgetsData(mockRequest['body-json'].walletId, '2021-02', '2021-03', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Budget).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
