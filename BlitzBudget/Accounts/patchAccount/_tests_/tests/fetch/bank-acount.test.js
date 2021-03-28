const fetchAccounts = require('../../../fetch/bank-account');
const mockAccountResponse = require('../../fixtures/response/fetchBankAccount.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockAccountResponse),
  })),
};

describe('Fetch Account item', () => {
  test('With Data: Success', async () => {
    const response = await fetchAccounts
      .getBankAccountItem(mockAccountResponse.Items[0].pk, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Account).not.toBeUndefined();
    expect(response.Account[0]).not.toBeUndefined();
    expect(response.Account[0].account_balance).not.toBeUndefined();
    expect(response.Account[0].account_type).not.toBeUndefined();
    expect(response.Account[0].bank_account_name).not.toBeUndefined();
    expect(response.Account[0].linked).not.toBeUndefined();
    expect(response.Account[0].pk).not.toBeUndefined();
    expect(response.Account[0].sk).not.toBeUndefined();
    expect(response.Account[0].selected_account).not.toBeUndefined();
  });
});
