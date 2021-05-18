const updateDate = require('../../../update/date');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Update Date item', () => {
  const walletId = mockRequest.Records[0].dynamodb.NewImage.pk.S;
  test('Without Matching Date: Success', async () => {
    const response = await updateDate
      .updateDateItem(walletId, 'sk', 'balance', 'income', 'expense', documentClient);
    expect(response).not.toBeUndefined();
  });
});
