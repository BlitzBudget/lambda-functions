const deleteItems = require('../../../utils/delete-helper');
const response = require('../../fixtures/response/fetchRecurringTransaction.json');
const transactionResponse = require('../../fixtures/response/fetchTransaction.json');

const dynamoDB = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('delete item', () => {
  const event = [response, transactionResponse];
  const { walletId } = response.Items[0];
  const accountId = response.Items[0].account;
  test('With Data: Success', async () => {
    const deleteResponse = await deleteItems
      .buildRequestAndDeleteAccount(event, walletId, accountId, dynamoDB);
    expect(deleteResponse).toBeUndefined();
  });
});
