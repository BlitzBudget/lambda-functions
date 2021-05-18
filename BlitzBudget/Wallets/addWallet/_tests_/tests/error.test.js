const addWallet = require('../../index');
const mockRequest = require('../fixtures/request/addWallet.json');
const mockResponse = require('../fixtures/response/addWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Add Wallet item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    await addWallet
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
