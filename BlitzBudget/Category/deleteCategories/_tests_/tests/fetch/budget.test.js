const fetchBudget = require('../../../fetch/budget');
const mockRequest = require('../../fixtures/request/deleteCategories.json');
const mockResponse = require('../../fixtures/response/fetchBudget.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Budget item', () => {
  test('Success', async () => {
    const response = await fetchBudget
      .getBudgetItems('walletID', '2020-03', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Items).not.toBeUndefined();
    expect(response.Items[0].pk).toBe(mockRequest['body-json'].walletId);
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
