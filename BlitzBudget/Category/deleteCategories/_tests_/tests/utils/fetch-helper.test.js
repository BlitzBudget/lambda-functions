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

describe('Fetch Helper item: Without Count', () => {
  const documentClientWithoutCount = {
    query: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({
        Items: [],
        Count: 0,
      }),
    })),
  };
  test('Count 0: Success', async () => {
    const response = await fetchHelper
      .fetchAllItemsToDelete('walletID', '2020-03', documentClientWithoutCount);
    expect(response).not.toBeUndefined();
    expect(response[0]).not.toBeUndefined();
    expect(response[1]).not.toBeUndefined();
    expect(response[0].Items).not.toBeUndefined();
    expect(response[1].Items).not.toBeUndefined();
    expect(response[0].Items.length).toBe(0);
    expect(response[1].Items.length).toBe(0);
    expect(documentClientWithoutCount.query).toHaveBeenCalledTimes(2);
  });
});
