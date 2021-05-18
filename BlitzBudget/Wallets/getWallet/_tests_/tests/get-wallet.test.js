const getTransaction = require('../../index');
const mockRequest = require('../fixtures/request/getWallets.json');
const mockResponse = require('../fixtures/response/fetchWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Get Budget item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await getTransaction
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response.Wallet).not.toBeUndefined();
    expect(response.Wallet[0].currency).toBe('Euro');
  });
});
