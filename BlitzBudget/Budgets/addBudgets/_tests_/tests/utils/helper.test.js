const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');
const mockRequestWithoutDate = require('../../fixtures/request/withoutDate.json');

describe('extractVariablesFromRequest', () => {
  const events = mockRequest;
  test('With Data: Success', async () => {
    const response = await helper
      .extractVariablesFromRequest(events);

    expect(response.dateMeantFor).not.toBeUndefined();
    expect(response.walletId).not.toBeUndefined();
  });
});

describe('convertToDate', () => {
  const events = mockRequest;
  test('With Date: Success', async () => {
    const today = await helper
      .convertToDate(events);
    expect(today).not.toBeUndefined();
    expect(today.getMonth()).not.toBeUndefined();
    expect(today.getFullYear()).not.toBeUndefined();
    expect(today.getMonth()).toBe(4);
    expect(today.getFullYear()).toBe(2020);
  });

  const eventsWithoutDate = mockRequestWithoutDate;
  test('With out Date: Success', async () => {
    const today = await helper
      .convertToDate(eventsWithoutDate);
    expect(today).not.toBeUndefined();
    expect(today.getMonth()).not.toBeUndefined();
    expect(today.getFullYear()).not.toBeUndefined();
    expect(today.getMonth()).toBe(4);
    expect(today.getFullYear()).toBe(2020);
  });
});
