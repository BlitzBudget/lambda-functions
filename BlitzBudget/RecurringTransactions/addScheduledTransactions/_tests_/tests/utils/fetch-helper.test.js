const fetchHelper = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');
const mockResponse = require('../../fixtures/response/fetch-category.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

const documentClientForDate = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('pushAllCategoriesToFetch', () => {
  const futureTransactionsToCreate = [];
  const events = [];
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  const categoryType = event.Records[0].Sns.MessageAttributes.categoryType.Value;
  const categoryName = event.Records[0].Sns.MessageAttributes.categoryName.Value;
  const category = event.Records[0].Sns.MessageAttributes.category.Value;
  futureTransactionsToCreate.push('2021-03');
  futureTransactionsToCreate.push('2021-02');
  futureTransactionsToCreate.push('2021-01');

  test('Without User ID Data: Success', async () => {
    await fetchHelper
      .pushAllCategoriesToFetch(
        category,
        walletId,
        categoryType, categoryName,
        documentClient, futureTransactionsToCreate, events,
      );

    expect(events).not.toBeUndefined();
    expect(events.length).toBe(3);
    expect(documentClient.query).toHaveBeenCalledTimes(3);
  });
});

describe('calculateAndAddAllDates', () => {
  const futureTransactionsToCreate = []; const
    events = [];
  const datesMap = {};
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  futureTransactionsToCreate.push('2021-03');
  futureTransactionsToCreate.push('2021-02');
  futureTransactionsToCreate.push('2021-01');
  test('With Data: Success', async () => {
    await fetchHelper
      .calculateAndAddAllDates(
        futureTransactionsToCreate,
        walletId,
        datesMap,
        events,
        documentClientForDate,
      );

    expect(events).not.toBeUndefined();
    expect(events.length).toBe(3);
    expect(documentClientForDate.query).toHaveBeenCalledTimes(3);
  });
});
