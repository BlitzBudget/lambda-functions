const fetchAccounts = require('../../index');
const mockAccountResponse = require('../fixtures/response/fetchBankAccount.json');
const mockAccountRequest = require('../fixtures/request/patchAccount.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockAccountResponse),
      })),
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Patch Account item', () => {
  const event = mockAccountRequest;
  test('With Data: Success', async () => {
    const response = await fetchAccounts
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
    expect(response['body-json'].accountBalance).not.toBeUndefined();
    expect(response['body-json'].bankAccountId).not.toBeUndefined();
    expect(response['body-json'].bankAccountName).not.toBeUndefined();
  });
});
