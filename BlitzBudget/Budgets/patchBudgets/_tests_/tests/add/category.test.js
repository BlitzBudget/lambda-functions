const addCategory = require('../../../add/category');
const mockRequest = require('../../fixtures/request/patchBudgets.json');
const mockResponse = require('../../fixtures/response/addCategory.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Category item', () => {
  test('Without Matching Category: Success', async () => {
    const response = await addCategory
      .createCategoryItem(mockRequest,
        'Category#2020-05-18T06:36:42.747Z',
        'Bills & Fees',
        documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(response.Category.sk).not.toBeUndefined();
    expect(response.Category.pk).not.toBeUndefined();
  });
});
