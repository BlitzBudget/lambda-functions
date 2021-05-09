const fetchHelper = require('../../../utils/fetch-helper');
const mockUserRequest = require('../../fixtures/request/byUserId.json');
const mockResponse = require('../../fixtures/response/fetch-budget.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('fetchWalletsIfEmpty : User', () => {
  test('With WalletId Data: Success', async () => {
    mockResponse.Items[0].walletId = mockResponse.Items[0].pk;
    const { walletPK, response } = await
    fetchHelper.fetchWalletsIfEmpty('', mockUserRequest['body-json'].userId, documentClient);
    expect(response).not.toBeUndefined();
    expect(walletPK).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
