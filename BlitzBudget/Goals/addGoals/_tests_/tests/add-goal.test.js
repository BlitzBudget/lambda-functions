const addGoal = require('../../index');
const mockRequest = require('../fixtures/request/addGoals.json');
const mockResponse = require('../fixtures/response/success.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Add Goal item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await addGoal
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].goalType).not.toBeUndefined();
    expect(response['body-json'].targetAmount).not.toBeUndefined();
    expect(response['body-json'].targetType).toMatch(/Account/);
  });
});
