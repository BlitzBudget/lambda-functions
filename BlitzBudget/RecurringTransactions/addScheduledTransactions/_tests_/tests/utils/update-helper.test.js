const updateHelper = require('../../../utils/update-helper');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('updateRecurringTransaction', () => {
  const futureTransactionsToCreate = 'date';
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  const recurringTransactionsId = 'sk';
  const events = [];
  test('Without User ID Data: Success', async () => {
    await updateHelper
      .updateRecurringTransaction(walletId, recurringTransactionsId, futureTransactionsToCreate,
        documentClient, events);

    expect(events).not.toBeUndefined();
    expect(events.length).toBe(1);
  });
});
