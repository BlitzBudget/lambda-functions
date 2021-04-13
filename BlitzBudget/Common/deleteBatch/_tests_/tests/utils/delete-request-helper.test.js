const deleteRequestHelper = require('../../../utils/delete-request-helper');
const mockResponse = require('../../fixtures/response/fetchResponse.json');

const documentClient = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Delete Helper', () => {
  const events = [];

  test('Success', async () => {
    await deleteRequestHelper
      .bulkDeleteRequest(
        [1, 2, 3, 4, 5, 6, 7], events, documentClient,
      );
    expect(events).not.toBeUndefined();
    expect(events.length).toBe(7);
    expect(documentClient.batchWrite).toHaveBeenCalledTimes(7);
  });
});
