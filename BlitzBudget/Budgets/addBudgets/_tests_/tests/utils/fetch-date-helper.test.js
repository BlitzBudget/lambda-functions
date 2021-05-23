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

test('Fetch Date: Error', async () => {
  const documentClientError = {
    query: jest.fn(() => ({
      promise: jest.fn().mockRejectedValueOnce(mockResponse),
    })),
  };

  await fetchDate
    .fetchDateData(
      mockRequest['body-json'].walletId, new Date(), documentClientError,
    ).catch((err) => {
      expect(err.message).toMatch(/Unable to fetch the Date/);
    });
  expect(documentClientError.query).toHaveBeenCalledTimes(1);
});
