const updateAccount = require('../../../update/account');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Update Account item', () => {
  const walletId = mockRequest.Records[0].dynamodb.NewImage.pk.S;
  test('Without Matching Account: Success', async () => {
    const response = await updateAccount
      .updateAccountBalanceItem(walletId, 'sk', 'balance', documentClient);
    expect(response).not.toBeUndefined();
  });
});
