const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/patchGoals.json');
const mockResponse = require('../fixtures/response/updateTargetId.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Patch Goal item', () => {
  const event = mockRequest;
  test('With Data: Success', async () => {
    const response = await patchBudget
      .handler(event);
    expect(response).not.toBeUndefined();
    expect(response['body-json']).not.toBeUndefined();
    expect(response['body-json'].walletId).not.toBeUndefined();
    expect(response['body-json'].goalId).not.toBeUndefined();
    expect(response['body-json'].targetId).not.toBeUndefined();
    expect(response['body-json'].targetType).not.toBeUndefined();
    expect(response['body-json'].goalType).not.toBeUndefined();
  });
});
