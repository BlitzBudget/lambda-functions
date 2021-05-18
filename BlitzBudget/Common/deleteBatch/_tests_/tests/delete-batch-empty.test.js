const deleteBatch = require('../../index');
const mockRequest = require('../fixtures/request/deleteBatch.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      batchWrite: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
  SNS: jest.fn(() => ({
    publish: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  })),
}));

describe('Delete One Item : Empty', () => {
  const event = mockRequest;
  event.params.querystring.itemIdArray = [];
  test('With Data: Success', async () => {
    const response = await deleteBatch
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
  });
});
