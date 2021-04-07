const updateBudget = require('../../../update/budget');
const mockRequest = require('../../fixtures/request/patchBudgets.json');
const mockResponse = require('../../fixtures/response/fetchBudget.json');

const documentClient = {
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Budget item', () => {
  test('Without Matching Budget: Success', async () => {
    const response = await updateBudget
      .updatingBudgets(mockRequest, documentClient);
    expect(response).not.toBeUndefined();
  });
});
