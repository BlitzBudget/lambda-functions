const addGoal = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/addGoals.json');
const mockResponse = require('../../fixtures/response/success.json');

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
  test('With Data: Success', async () => {
    const response = await addGoal
      .handleAddNewGoal(mockRequest);
    expect(response).toBeUndefined();
  });
});
