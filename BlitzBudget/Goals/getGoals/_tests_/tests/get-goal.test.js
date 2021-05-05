const getGoal = require('../../index');
const mockRequest = require('../fixtures/request/byUserId.json');
const mockResponse = require('../fixtures/response/fetch-goal.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      query: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
      get: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Get Goal item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await getGoal
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response.BankAccount).not.toBeUndefined();
    expect(response.Goal).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
  });
});
