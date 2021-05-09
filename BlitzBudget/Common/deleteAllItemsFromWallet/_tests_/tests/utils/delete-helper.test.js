const deleteHelper = require('../../../utils/delete-helper');
const mockResponse = require('../../fixtures/response/fetchResponse.json');

const documentClient = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Delete helper', () => {
  test('With Data: Success', async () => {
    const response = await deleteHelper
      .bulkDeleteItems(mockResponse, 'walletId', documentClient);

    expect(response).toBeUndefined();
    expect(documentClient.batchWrite).toHaveBeenCalledTimes(1);
  });
});
