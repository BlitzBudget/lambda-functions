const updateCategory = require('../../../update/category');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Update Category item', () => {
  const walletId = mockRequest.Records[0].dynamodb.NewImage.pk.S;
  test('Without Matching Category: Success', async () => {
    const response = await updateCategory
      .updateCategoryItem(walletId, 'sk', 'difference', documentClient);
    expect(response).not.toBeUndefined();
  });
});
