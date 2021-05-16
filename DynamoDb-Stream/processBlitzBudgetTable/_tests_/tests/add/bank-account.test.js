const addAccount = require('../../../add/bank-account');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Add Account item', () => {
  test('Without Matching Account: Success', async () => {
    const response = await addAccount
      .addNewBankAccount(mockRequest.Records[0], documentClient);
    expect(response).not.toBeUndefined();
  });
});
