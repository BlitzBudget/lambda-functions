const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/patchWallet.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce({}),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Patch Wallet item', () => {
  const event = mockRequest;
  test('With Data: Error Update', async () => {
    await patchBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
