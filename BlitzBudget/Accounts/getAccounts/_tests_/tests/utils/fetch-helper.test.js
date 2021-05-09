const fetchAccounts = require('../../../utils/fetch-helper');
const mockAccountResponse = require('../../fixtures/response/fetchAccount.json');
const mockAccountRequest = require('../../fixtures/request/getAccounts.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockAccountResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Fetch Account item', () => {
  const event = mockAccountRequest;
  test('With Data: Success', async () => {
    const response = await fetchAccounts
      .handleFetchBankAccount(event);
    expect(response).not.toBeUndefined();
    expect(response.length).not.toBeUndefined();
    expect(response.length).toBe(1);
    expect(response[0].account_balance).not.toBeUndefined();
    expect(response[0].account_type).not.toBeUndefined();
    expect(response[0].bank_account_name).not.toBeUndefined();
    expect(response[0].linked).not.toBeUndefined();
    expect(response[0].walletId).not.toBeUndefined();
    expect(response[0].accountId).not.toBeUndefined();
    expect(response[0].selected_account).not.toBeUndefined();
  });
});
