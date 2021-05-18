const deleteBatch = require('../../index');
const mockRequest = require('../fixtures/request/deleteBatch.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      batchWrite: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce({}),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
  SNS: jest.fn(() => ({
    publish: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  })),
}));

describe('Delete One Item item', () => {
  const event = mockRequest;
  test('With Data: Error Batchwrite', async () => {
    await deleteBatch
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
