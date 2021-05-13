const fetchCategory = require('../../../fetch/category');
const mockRequest = require('../../fixtures/request/patchTransactions.json');
const mockResponse = require('../../fixtures/response/fetchCategory.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Category item', () => {
  test('Without Matching Category: Success', async () => {
    const response = await fetchCategory
      .getCategoryData(mockRequest, new Date(), documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Category).toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });

  test('With Matching Category', async () => {
    mockRequest['body-json'].category = 'Salary';

    const withCategoryResponse = await fetchCategory
      .getCategoryData(mockRequest, new Date(), documentClient);
    expect(withCategoryResponse).not.toBeUndefined();
    expect(withCategoryResponse.Category).not.toBeUndefined();
    expect(withCategoryResponse.Category.category_name).toBe(mockRequest['body-json'].category);
    expect(withCategoryResponse.Category.category_type).toBe(mockRequest['body-json'].categoryType);
  });
});
