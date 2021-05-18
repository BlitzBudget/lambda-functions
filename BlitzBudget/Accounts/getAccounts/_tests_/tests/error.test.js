const fetchAccounts = require('../../index');
const mockAccountResponse = require('../fixtures/response/fetchAccount.json');
const mockAccountRequest = require('../fixtures/request/getAccounts.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockAccountResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Fetch Account item: ERROR', () => {
  const event = mockAccountRequest;
  test('With Data: Success', async () => {
    await fetchAccounts
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
