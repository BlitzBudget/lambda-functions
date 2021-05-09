const fetchHelper = require('../../../utils/fetch-helper');
const mockResponse = require('../../fixtures/response/fetchBudget.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Helper item', () => {
  test('Success', async () => {
    const response = await fetchHelper
      .fetchAllItemsToDelete('walletID', '2020-03', documentClient);
    expect(response).not.toBeUndefined();
    expect(response[0]).not.toBeUndefined();
    expect(response[1]).not.toBeUndefined();
    expect(response[0].Items).not.toBeUndefined();
    expect(response[1].Items).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(2);
  });
});
