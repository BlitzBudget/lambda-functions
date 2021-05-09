const deleteItems = require('../../../delete/items');
const mockRequest = require('../../fixtures/request/deleteBatch.json');
const mockResponse = require('../../fixtures/response/fetchResponse.json');

const documentClient = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
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
