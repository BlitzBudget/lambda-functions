const getBudget = require('../../index');
const mockRequest = require('../fixtures/request/deleteOneItem.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      delete: jest.fn(() => ({
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

describe('Delete One Item item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await getBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
  });
});
