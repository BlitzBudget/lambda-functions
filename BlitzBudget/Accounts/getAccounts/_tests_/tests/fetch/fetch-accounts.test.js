const fetchAccounts = require('../../../fetch/fetch-accounts');
const mockAccountResponse = require('../../fixtures/response/fetchAccount.json');

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
  test('With Data: Success', async () => {
    const response = await fetchAccounts
      .getBankAccountItem(mockAccountResponse.Items[0].pk);
    expect(response).not.toBeUndefined();
  });
});
