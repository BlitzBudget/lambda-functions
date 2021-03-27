const addAccount = require('../../index');
const mockRequest = require('../fixtures/request/addAccounts');
const mockResponse = require('../fixtures/response/dynamodb-response');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('index: handler', () => {
  const event = mockRequest;

  test('With Data: Success', async () => {
    const response = await addAccount.handler(event);
    expect(response).not.toBeUndefined();
    expect(response.accountBalance).not.toBeUndefined();
    expect(response.accountId).not.toBeUndefined();
    expect(response.accountSubType).not.toBeUndefined();
    expect(response.accountType).not.toBeUndefined();
    expect(response.bankAccountName).not.toBeUndefined();
    expect(response.linked).not.toBeUndefined();
    expect(response.primaryWallet).not.toBeUndefined();
    expect(response.selectedAccount).not.toBeUndefined();
    expect(response.walletId).not.toBeUndefined();
  });
});
