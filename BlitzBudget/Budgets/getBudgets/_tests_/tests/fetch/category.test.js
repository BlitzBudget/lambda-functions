const fetchCategory = require('../../../fetch/category');
const mockRequest = require('../../fixtures/request/getBudgets.json');
const mockResponse = require('../../fixtures/response/fetch-category.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Category item', () => {
  test('Without Matching Category: Success', async () => {
    const response = await fetchCategory
      .getCategoryData(mockRequest['body-json'].walletId, '2021-02', '2021-03', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
