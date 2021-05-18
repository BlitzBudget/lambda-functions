const addWallet = require('../../index');
const mockRequest = require('../fixtures/request/addWallet.json');
const mockResponse = require('../fixtures/response/addWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Add Wallet item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await addWallet
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
    expect(response['body-json'].userId).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].total_debt_balance).not.toBeUndefined();
    expect(response['body-json'].total_asset_balance).not.toBeUndefined();
    expect(response['body-json'].wallet_balance).not.toBeUndefined();
  });
});
