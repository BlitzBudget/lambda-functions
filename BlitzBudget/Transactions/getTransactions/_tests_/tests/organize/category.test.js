const organizeCategory = require('../../../organize/category');
const mockResponse = require('../../fixtures/response/successWithoutOrganization.json');

describe('organizeCategory: createParameter', () => {
  test('With Data: Success', () => {
    organizeCategory.organize(mockResponse, [], true);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Category).not.toBeUndefined();
    expect(mockResponse.Category[0].categoryId).not.toBeUndefined();
    expect(mockResponse.Category[0].walletId).not.toBeUndefined();
  });
});
