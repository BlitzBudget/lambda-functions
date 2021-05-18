const addCategory = require('../../../add/category');
const mockRequest = require('../../fixtures/request/patchTransactions.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({ Attributes: {} }),
  })),
};

describe('Add Category item', () => {
  test('With Data: Success', async () => {
    const response = await addCategory
      .createCategoryItem(mockRequest, 'sk', 'categoryName', documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
