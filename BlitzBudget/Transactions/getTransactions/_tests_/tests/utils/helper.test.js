const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/getTransactions.json');
const mockResponse = require('../../fixtures/response/success-without-organization.json');

describe('extractVariablesFromRequest', () => {
  const events = mockRequest;
  test('With Data: Success', async () => {
    const {
      startsWithDate,
      endsWithDate,
      userId,
    } = await helper
      .extractVariablesFromRequest(events);

    expect(startsWithDate).not.toBeUndefined();
    expect(endsWithDate).not.toBeUndefined();
    expect(userId).toBeUndefined();
  });
});

describe('isFullMonth', () => {
  test('Full Month: Success', async () => {
    const { isAFullMonth, percentage } = await helper
      .isFullMonth('2021-03-01', '2021-03-31');

    expect(isAFullMonth).not.toBeUndefined();
    expect(percentage).not.toBeUndefined();
    expect(isAFullMonth).toBe(true);
    expect(percentage).toBe(1);
  });

  test('Not a Full Month: Success', async () => {
    const response = await helper
      .isFullMonth('2021-03-01', '2021-03-20');

    expect(response.isAFullMonth).toBe(false);
    expect(response.percentage).not.toBeUndefined();
    expect(response.isAFullMonth).toBe(false);
    expect(response.percentage).toBe(0.6333333333333333);
  });
});

describe('calculateDateAndCategoryTotal', () => {
  test('With Data: Success', async () => {
    const response = await helper.calculateDateAndCategoryTotal(true, mockResponse, 1);
    expect(response).not.toBeUndefined();
    expect(response.incomeTotal).not.toBeUndefined();
    expect(response.expenseTotal).not.toBeUndefined();
    expect(response.balance).not.toBeUndefined();
    expect(response.Date[0].dateId).not.toBeUndefined();
    expect(response.Date[0].walletId).not.toBeUndefined();
    expect(response.Transaction[0].walletId).not.toBeUndefined();
    expect(response.Transaction[0].transactionId).not.toBeUndefined();
    expect(response.Category[0].walletId).not.toBeUndefined();
    expect(response.Category[0].categoryId).not.toBeUndefined();
    expect(response.Budget[0].walletId).not.toBeUndefined();
    expect(response.Budget[0].budgetId).not.toBeUndefined();
  });
});
