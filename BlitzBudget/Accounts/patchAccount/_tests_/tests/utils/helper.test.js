const helper = require('../../../utils/helper');
const mockAccountResponse = require('../../fixtures/response/fetchBankAccount.json');
const mockRequest = require('../../fixtures/request/patchAccount.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockAccountResponse),
      })),
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('unselectSelectedBankAccount', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const events = await helper
      .unselectSelectedBankAccount(event);
    expect(events).not.toBeUndefined();
    expect(events.length).not.toBeUndefined();
    expect(events.length).toBe(1);
  });
});

describe('handleUpdateBankAccounts', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const events = await helper
      .handleUpdateBankAccounts(event, []);
    expect(events).toBeUndefined();
  });
});
