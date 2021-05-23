const fetchHelper = require('../../../utils/fetch-helper');
const mockRequest = require('../../fixtures/request/getBudgets.json');
const mockResponse = require('../../fixtures/response/fetch-budget.json');

const documentClient = {
  query: jest.fn(() => ({
    promise: jest.fn().mockResolvedValueOnce(mockResponse),
  })),
};

describe('fetchAllInformationForBudget', () => {
  const events = mockRequest;
  test('With Data: Success', async () => {
    const response = await fetchHelper.fetchAllInformationForBudget(events['body-json'].walletId, '2021-02', '2021-03', true, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Budget).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(response.BankAccount).not.toBeUndefined();
    expect(documentClient.query).toHaveBeenCalledTimes(4);
  });

  test('With Data Not A Full Month: Success', async () => {
    const response = await fetchHelper.fetchAllInformationForBudget(events['body-json'].walletId, '2021-02', '2021-03', false, documentClient);
    expect(response).not.toBeUndefined();
    expect(response.Budget).not.toBeUndefined();
    expect(response.Transaction).not.toBeUndefined();
    expect(response.Category).not.toBeUndefined();
    expect(response.Date).not.toBeUndefined();
    expect(response.BankAccount).not.toBeUndefined();
  });

  test('With Data: Error', async () => {
    const documentClientWithError = {
      query: jest.fn(() => ({
        promise: jest.fn().mockRejectedValueOnce(mockResponse),
      })),
    };
    await fetchHelper.fetchAllInformationForBudget(
      events['body-json'].walletId, '2021-02', '2021-03', true, documentClientWithError,
    ).catch((err) => {
      expect(err).not.toBeUndefined();
      expect(err.message).toMatch(/Unable error occured while fetching the Budget/);
    });
  });
});

describe('fetchWalletsIfEmpty : Wallet', () => {
  const events = mockRequest;
  test('With WalletId Data: Success', async () => {
    const { walletPK, response } = await fetchHelper.fetchWalletsIfEmpty(events['body-json'].walletId, '', documentClient);
    expect(response).toBeUndefined();
    expect(walletPK).not.toBeUndefined();
  });
});
