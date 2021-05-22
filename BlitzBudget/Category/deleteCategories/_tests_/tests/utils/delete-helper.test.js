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
      .bulkDeleteItems(mockResponse, '', 'categoryId', documentClient);

    expect(response).toBeUndefined();
    expect(documentClient.batchWrite).toHaveBeenCalledTimes(1);
  });

  test('With Data: Success', async () => {
    const response = await deleteHelper
      .bulkDeleteItems(mockResponse, '', 'Category#2021-01-04T15:39:23.658Z', documentClient);

    expect(response).toBeUndefined();
    expect(documentClient.batchWrite).toHaveBeenCalledTimes(2);
  });
});
