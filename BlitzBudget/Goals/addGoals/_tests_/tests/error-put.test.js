const addGoal = require('../../index');
const mockRequest = require('../fixtures/request/addGoals.json');
const mockResponse = require('../fixtures/response/success.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: jest.fn(() => ({
    DocumentClient: jest.fn(() => ({
      put: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  })),
  config: {
    update: jest.fn(),
  },
}));

describe('Add Goal item', () => {
  const event = mockRequest;
  test('With Data: Error Put', async () => {
    await addGoal
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
