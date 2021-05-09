const updateBudget = require('../../../patch/goal');
const mockRequest = require('../../fixtures/request/patchGoals.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockResolvedValueOnce({}),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Update Budget item', () => {
  test('Without Matching Budget: Success', async () => {
    const response = await updateBudget
      .updatingGoals(mockRequest);
    expect(response).not.toBeUndefined();
  });
});
