const updateAccount = require('../../../utils/update-account-helper');
const mockRequest = require('../../fixtures/request/processBlitzBudgetTable.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Update Account item', () => {
  const events = [];
  test('MODIFY Account: Success', async () => {
    await updateAccount
      .updateAccountBalance(mockRequest.Records[0], events, documentClient);
    expect(events.length).toBe(1);
  });

  test('INSERT Account: Success', async () => {
    await updateAccount
      .updateAccountBalance(mockRequest.Records[3], events, documentClient);
    expect(events.length).toBe(2);
  });

  test('REMOVE Account: Success', async () => {
    await updateAccount
      .updateAccountBalance(mockRequest.Records[2], events, documentClient);
    expect(events.length).toBe(3);
  });
});
