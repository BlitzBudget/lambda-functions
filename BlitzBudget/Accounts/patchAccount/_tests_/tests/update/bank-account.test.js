const updateAccounts = require('../../../update/bank-account');
const mockAccountResponse = require('../../fixtures/response/fetchBankAccount.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Update Account item', () => {
  test('With Data: Success', async () => {
    const response = await updateAccounts
      .updatingBankAccounts(mockAccountResponse.Items[0].pk, documentClient);
    expect(response).not.toBeUndefined();
  });
});
