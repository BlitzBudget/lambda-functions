const getTransaction = require('../../index');
const mockRequest = require('../fixtures/request/byUserId.json');
const mockResponse = require('../fixtures/response/fetchTransaction.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  SNS: jest.fn(() => ({
    publish: jest.fn(() => ({
      promise: jest.fn().mockResolvedValueOnce({}),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Get Budget item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await getTransaction
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response.BankAccount).not.toBeUndefined();
    expect(response.Budget).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(response.Transaction).not.toBeUndefined();
  });
});
