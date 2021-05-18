const fetchAccounts = require('../../../fetch/fetch-accounts');
const mockAccountResponse = require('../../fixtures/response/fetchAccount.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockAccountResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Fetch Account item', () => {
  test('With Data: Success', async () => {
    const response = await fetchAccounts
      .getBankAccountItem(mockAccountResponse.Items[0].pk);
    expect(response).not.toBeUndefined();
    expect(response.Items.length).not.toBeUndefined();
    expect(response.Items.length).toBe(1);
    expect(response.Items[0].account_balance).not.toBeUndefined();
    expect(response.Items[0].account_type).not.toBeUndefined();
    expect(response.Items[0].bank_account_name).not.toBeUndefined();
    expect(response.Items[0].linked).not.toBeUndefined();
    expect(response.Items[0].pk).not.toBeUndefined();
    expect(response.Items[0].sk).not.toBeUndefined();
    expect(response.Items[0].selected_account).not.toBeUndefined();
  });
});
