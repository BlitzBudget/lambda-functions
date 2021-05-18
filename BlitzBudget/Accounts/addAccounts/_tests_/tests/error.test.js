const addAccount = require('../../index');
const mockRequest = require('../fixtures/request/addAccounts');
const mockResponse = require('../fixtures/response/dynamodb-response');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('index: handler', () => {
  const event = mockRequest;

  test('With Data: ERROR', async () => {
    await addAccount.handler(event).catch((err) => {
      expect(err).not.toBeUndefined();
    });
  });
});
