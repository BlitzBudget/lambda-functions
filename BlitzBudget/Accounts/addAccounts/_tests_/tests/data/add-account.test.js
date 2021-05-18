const addAccount = require('../../../data/add-account');
const mockRequest = require('../../fixtures/request/addAccounts');
const mockResponse = require('../../fixtures/response/dynamodb-response');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('addNewBankAccounts', () => {
  const event = mockRequest;

  test('With Data: Success', async () => {
    const response = await addAccount.addNewBankAccounts(event);
    expect(response).not.toBeUndefined();
  });
});
