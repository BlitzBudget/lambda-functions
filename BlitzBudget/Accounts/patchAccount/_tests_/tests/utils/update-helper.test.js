const updateHelper = require('../../../utils/update-helper');
const mockAccountResponse = require('../../fixtures/response/fetchBankAccount.json');
const mockRequest = require('../../fixtures/request/patchAccount.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockAccountResponse),
  })),
};

describe('updateBankAccountToUnselected', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const events = await updateHelper
      .updateBankAccountToUnselected(event, documentClient);
    expect(events).not.toBeUndefined();
    expect(events.length).not.toBeUndefined();
    expect(events.length).toBe(0);
    expect(documentClient.update).toHaveBeenCalledTimes(0);
  });

  test('With Data: Success', async () => {
    const request = { Account: mockAccountResponse.Items };
    const events = await updateHelper
      .updateBankAccountToUnselected(request, documentClient);
    expect(events).not.toBeUndefined();
    expect(events.length).not.toBeUndefined();
    expect(events.length).toBe(1);
    expect(documentClient.update).toHaveBeenCalledTimes(1);
  });
});
