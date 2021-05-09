const fetchDate = require('../../../fetch/date');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');
const mockResponse = require('../../fixtures/response/fetchDate.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('Fetch Date item', () => {
  test('Without Matching Date: Success', async () => {
    const response = await fetchDate
      .getDateData(mockRequest['body-json'].walletId, new Date(), documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(response.Date[0].sk).not.toBeUndefined();
    expect(response.Date[0].sk).toMatch(/2021-04/);
    expect(documentClient.query).toHaveBeenCalledTimes(1);
  });
});
