const fetchGoal = require('../../../fetch/goal');
const mockRequest = require('../../fixtures/request/getGoals.json');
const mockResponse = require('../../fixtures/response/fetch-goal.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Goal item', () => {
  test('Without Matching Goal: Success', async () => {
    const response = await fetchGoal
      .getGoalData(mockRequest['body-json'].walletId, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Goal).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
