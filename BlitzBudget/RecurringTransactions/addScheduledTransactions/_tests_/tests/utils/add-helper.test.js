const addHelper = require('../../../utils/add-helper');
const mockRequest = require('../../fixtures/request/addScheduledTransactions.json');

const documentClient = {
  batchWrite: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce({}),
  })),
};

describe('constructRequestAndCreateItems', () => {
  const createTransactionArray = [];
  const datesMap = {};
  const categoryMap = {};
  test('Without User ID Data: Success', async () => {
    await addHelper
      .constructRequestAndCreateItems(
        [],
        datesMap,
        categoryMap,
        mockRequest,
        documentClient,
        createTransactionArray,
      );

    expect(createTransactionArray).not.toBeUndefined();
    expect(createTransactionArray.length).not.toBe(0);
  });
});

describe('calculateAndAddAllCategories', () => {
  const futureTransactionsToCreate = []; const
    events = [];
  const datesMap = {};
  const categoryMap = {};
  const event = mockRequest;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  const categoryType = event.Records[0].Sns.MessageAttributes.categoryType.Value;
  const categoryName = event.Records[0].Sns.MessageAttributes.categoryName.Value;
  const category = event.Records[0].Sns.MessageAttributes.category.Value;
  test('Without User ID Data: Success', async () => {
    await addHelper
      .calculateAndAddAllCategories(
        category, walletId, categoryType, categoryName,
        categoryMap,
        [],
        datesMap,
        events, documentClient, futureTransactionsToCreate,
      );

    expect(futureTransactionsToCreate).not.toBeUndefined();
    expect(futureTransactionsToCreate.length).toBe(0);
  });
});
