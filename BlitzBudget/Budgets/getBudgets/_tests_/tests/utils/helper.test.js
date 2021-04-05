const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/getBudgets.json');
const mockResponse = require('../../fixtures/response/success_data.json');

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
    const { isAFullMonth, percentage } = await helper
      .isFullMonth('2021-03-01', '2021-03-20');

    expect(isAFullMonth).not.toBeUndefined();
    expect(percentage).not.toBeUndefined();
    expect(isAFullMonth).toBe(false);
    expect(percentage).toBe(0.6333333333333333);
  });
});

describe('modifyTotalOfBudget', () => {
  test('Modify Total Budget: Success', async () => {
    await helper
      .modifyTotalOfBudget(1, true, mockResponse);

    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Budget[0].budgetId).not.toBeUndefined();
    expect(mockResponse.Budget[0].walletId).not.toBeUndefined();
    expect(mockResponse.Date[0].dateId).not.toBeUndefined();
    expect(mockResponse.Date[0].walletId).not.toBeUndefined();
    expect(mockResponse.Transaction).toBeUndefined();
  });
});
