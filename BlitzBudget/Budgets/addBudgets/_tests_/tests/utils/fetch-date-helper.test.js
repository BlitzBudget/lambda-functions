const fetchDate = require('../../../utils/fetch-date-helper');
const mockRequest = require('../../fixtures/request/addBudget.json');
const mockResponse = require('../../fixtures/response/fetch-date.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Date item', () => {
  test('Without Matching Date: Success', async () => {
    const response = await fetchDate
      .fetchDateData(mockRequest['body-json'].walletId, new Date(), documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(response.Date[0].sk).not.toBeUndefined();
    expect(response.Date[0].sk).toMatch(/2021-04/);
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
