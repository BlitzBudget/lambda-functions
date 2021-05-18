const patchBudget = require('../../index');
const mockRequest = require('../fixtures/request/patchGoals.json');
const mockResponse = require('../fixtures/response/updateTargetId.json');

jest.mock('aws-sdk', () => ({
  DynamoDB: {
    DocumentClient: jest.fn(() => ({
      update: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    })),
  },
  config: {
    update: jest.fn(),
  },
}));

describe('Patch Goal item', () => {
  const event = mockRequest;
  test('With Data: Error update', async () => {
    await patchBudget
      .handler(event).catch((err) => {
        expect(err).not.toBeUndefined();
      });
  });
});
