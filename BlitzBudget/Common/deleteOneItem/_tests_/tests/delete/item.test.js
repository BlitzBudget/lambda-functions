const deleteItems = require('../../../delete/item');
const mockRequest = require('../../fixtures/request/deleteOneItem.json');

const documentClient = {
  delete: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Delete items', () => {
  test('Success', async () => {
    const response = await deleteItems
      .deleteOneItem(
        mockRequest['body-json'].walletId,
        mockRequest['body-json'].itemId,
        documentClient,
      );
    expect(response).not.toBeUndefined();
    expect(documentClient.delete).toHaveBeenCalledTimes(1);
  });
});
