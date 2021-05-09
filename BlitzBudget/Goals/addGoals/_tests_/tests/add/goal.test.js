const addGoal = require('../../../add/goal');
const mockRequest = require('../../fixtures/request/addGoals.json');

const documentClient = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Add Goal item', () => {
  test('With Data: Success', async () => {
    const response = await addGoal
      .addNewGoals(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Goal).not.toBeUndefined();
    expect(documentClient.put).toHaveBeenCalledTimes(1);
  });
});
