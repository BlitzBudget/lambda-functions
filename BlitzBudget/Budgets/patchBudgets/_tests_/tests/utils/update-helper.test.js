const updateHelper = require('../../../utils/update-helper');
const mockRequest = require('../../fixtures/request/patchBudgets.json');
const mockResponse = require('../../fixtures/response/fetchBudget.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
  update: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Update Budget item', () => {
  test('Without Matching Budget: Success', async () => {
    const response = await updateHelper
      .updateBudgetIfNotPresent(mockRequest, [], documentClient);
    expect(response).toBeUndefined();
    expect(documentClient.update).toHaveBeenCalledTimes(1);
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
