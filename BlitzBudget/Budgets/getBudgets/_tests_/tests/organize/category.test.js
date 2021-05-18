const organizeCategory = require('../../../organize/category');
const mockResponse = require('../../fixtures/response/fetch-category.json');

describe('organizeCategory: createParameter', () => {
  test('With Data: Success', () => {
    organizeCategory.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).not.toBeUndefined();
    expect(mockResponse.Items[0].categoryId).not.toBeUndefined();
    expect(mockResponse.Items[0].walletId).not.toBeUndefined();
  });

  test('Without Data: Success', () => {
    mockResponse.Items = undefined;
    organizeCategory.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).toBeUndefined();
  });
});
