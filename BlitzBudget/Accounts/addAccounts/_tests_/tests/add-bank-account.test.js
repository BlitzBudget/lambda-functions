const addAccount = require('../../index');
const mockRequest = require('../fixtures/request/addAccounts');
const mockResponse = require('../fixtures/response/dynamodb-response');

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

describe('index: handler', () => {
  const event = mockRequest;

  test('With Data: Success', async () => {
    const response = await addAccount.handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json'].accountBalance).not.toBeUndefined();
    expect(response['body-json'].accountId).not.toBeUndefined();
    expect(response['body-json'].accountSubType).not.toBeUndefined();
    expect(response['body-json'].accountType).not.toBeUndefined();
    expect(response['body-json'].bankAccountName).not.toBeUndefined();
    expect(response['body-json'].linked).not.toBeUndefined();
    expect(response['body-json'].primaryWallet).not.toBeUndefined();
    expect(response['body-json'].selectedAccount).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
  });
});
