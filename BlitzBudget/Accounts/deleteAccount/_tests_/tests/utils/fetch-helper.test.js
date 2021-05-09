const fetchHelper = require('../../../utils/fetch-helper');
const fetchTransactionsResponse = require('../../fixtures/response/fetchTransaction.json');

const dynamoDB = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(fetchTransactionsResponse),
  })),
};

describe('Fetch Helper item', () => {
  test('With Data: Success', async () => {
    const response = await fetchHelper
      .fetchTransactionDataForAccount(fetchTransactionsResponse.Items[0].walletId, dynamoDB);
    expect(response).not.toBeUndefined();
    expect(response.length).not.toBeUndefined();
    expect(response.length).toBe(2);
    expect(response[0].Count).toBe(2);
    expect(response[1].Count).toBe(2);
  });
});
