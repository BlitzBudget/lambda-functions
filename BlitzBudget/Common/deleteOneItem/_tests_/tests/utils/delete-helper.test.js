const deleteHelper = require('../../../utils/delete-helper');
const mockRequest = require('../../fixtures/request/deleteOneItem.json');

const documentClient = {
  delete: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Delete items', () => {
  test('Success', async () => {
    const response = await deleteHelper
      .deleteAnItem(
        mockRequest['body-json'].walletId,
        mockRequest['body-json'].itemId,
        documentClient,
      );
    expect(response).toBeUndefined();
    expect(documentClient.delete).toHaveBeenCalledTimes(1);
  });
});
