const fetchBudget = require('../../../fetch/budget');
const mockRequest = require('../../fixtures/request/getBudgets.json');
const mockResponse = require('../../fixtures/response/fetch-budget.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Budget item', () => {
  test('Without Matching Budget: Success', async () => {
    const response = await fetchBudget
      .getBudgetData(mockRequest['body-json'].walletId, '2021-02', '2021-03', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Budget).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
