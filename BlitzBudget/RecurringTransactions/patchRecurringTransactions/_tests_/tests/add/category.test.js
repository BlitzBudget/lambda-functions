const addCategory = require('../../../add/category');
const mockRequest = require('../../fixtures/request/patchRecurringTransactions.json');
const mockResponse = require('../../fixtures/response/addCategory.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Add Category item', () => {
  test('With Data: Success', async () => {
    const response = await addCategory
      .createCategoryItem(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
