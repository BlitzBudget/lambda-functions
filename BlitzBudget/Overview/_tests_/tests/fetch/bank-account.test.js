const fetchBankAccount = require('../../../fetch/bank-account');
const mockRequest = require('../../fixtures/request/overview.json');
const mockResponse = require('../../fixtures/response/fetch-bank-account.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Bank Account item', () => {
  test('Without Matching BankAccount: Success', async () => {
    const response = await fetchBankAccount
      .getBankAccountData(mockRequest['body-json'].walletId, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.BankAccount).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
