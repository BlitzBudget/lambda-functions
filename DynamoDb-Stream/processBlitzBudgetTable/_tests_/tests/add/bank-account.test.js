const addAccount = require('../../../add/bank-account');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Add Account item', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.AWS_LAMBDA_REGION = '1';
    process.env.TABLE_NAME = '2';
  });
  test('Without Matching Account: Success', async () => {
    const response = await addAccount
      .addNewBankAccount(mockRequest.Records[0], documentClient);
    expect(response).not.toBeUndefined();
  });
});
