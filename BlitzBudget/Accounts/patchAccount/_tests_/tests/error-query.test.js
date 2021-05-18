const fetchAccounts = require('../../index');
const mockAccountResponse = require('../fixtures/response/fetchBankAccount.json');
const mockAccountRequest = require('../fixtures/request/patchAccount.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockAccountResponse),
      })),
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Patch Account item', () => {
  const event = mockAccountRequest;
  test('With Data: Error', async () => {
    await fetchAccounts
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
