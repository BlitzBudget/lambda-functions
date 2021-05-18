const getTransaction = require('../../index');
const mockRequest = require('../fixtures/request/getWallets.json');
const mockResponse = require('../fixtures/response/fetchWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Get Budget item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    await getTransaction
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
