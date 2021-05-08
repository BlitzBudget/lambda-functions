const recurringTransaction = require('../../../utils/update-helper');
const mockRequest = require('../../fixtures/request/patchRecurringTransactions.json');
const mockResponse = require('../../fixtures/response/updateResponse.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('With Update Helper Data', () => {
  const event = mockRequest;
  const events = [];
  test('Success', async () => {
    const response = await recurringTransaction
      .updateRecurringTransaction(
        events,
        event,
        documentClient,
      );
    expect(events.length).toBe(1);
    expect(response).not.toBeUndefined();
    expect(response.Transaction).toBe(mockResponse.Attributes);
  });
});
