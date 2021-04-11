const fetchItems = require('../../../fetch/items');
const mockRequest = require('../../fixtures/request/deleteAllItemsFromWallet.json');
const mockResponse = require('../../fixtures/response/fetchResponse.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Delete items', () => {
  test('Success', async () => {
    const response = await fetchItems
      .getAllItems(mockRequest.Records[0].Sns.Message, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Count).not.toBeUndefined();
    expect(response.Items).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
