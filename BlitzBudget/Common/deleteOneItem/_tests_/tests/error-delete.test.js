const deleteOneItem = require('../../index');
const mockRequest = require('../fixtures/request/deleteOneItem.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      delete: jest.fn(() => ({
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
  test('With Data: Error Delete', async () => {
    await deleteOneItem
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
