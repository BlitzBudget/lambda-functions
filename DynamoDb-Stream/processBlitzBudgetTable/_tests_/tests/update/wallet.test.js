const updateWallet = require('../../../update/wallet');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Update Wallet item', () => {
  const walletId = mockRequest.Records[0].dynamodb.NewImage.pk.S;
  test('Without Matching Wallet: Success', async () => {
    const response = await updateWallet
      .updateWalletBalance(walletId, 'sk', 'balance', 'assetBalance', 'debtBalance', documentClient);
    expect(response).not.toBeUndefined();
  });
});
