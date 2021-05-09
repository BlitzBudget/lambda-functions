const addBudget = require('../../../add/budget');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');

const documentClient = {
  put: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('Add Budget item', () => {
  test('With Data: Success', async () => {
    const response = await addBudget
      .addNewBudget(mockRequest, new Date('2021-05'), documentClient);
    expect(response).not.toBeUndefined();
    expect(response.success).not.toBeUndefined();
    expect(response.budgetId).not.toBeUndefined();
    expect(documentClient.put).toHaveBeenCalledTimes(1);
  });
});
