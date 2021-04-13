const deleteHelper = require('../../../utils/delete-helper');
const mockResponse = require('../../fixtures/response/fetchResponse.json');
const mockRequest = require('../../fixtures/request/deleteBatch.json');

const documentClient = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Delete helper', () => {
  test('With Data: Success', async () => {
    const events = [];
    await deleteHelper
      .deleteAllItemsInBulk(
        mockRequest.params.querystring.itemIdArray,
        mockRequest.params.querystring.walletId,
        events,
        documentClient,
      );

    expect(events.length).toBe(1);
    expect(documentClient.batchWrite).toHaveBeenCalledTimes(1);
  });
});
