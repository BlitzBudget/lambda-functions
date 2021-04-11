const deleteItems = require('../../../delete/items');
const mockRequest = require('../../fixtures/request/deleteAllItemsFromWallet.json');

const documentClient = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Delete items', () => {
  test('Success', async () => {
    const response = await deleteItems
      .deleteItems(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(documentClient.batchWrite).toHaveBeenCalledTimes(1);
  });
});
