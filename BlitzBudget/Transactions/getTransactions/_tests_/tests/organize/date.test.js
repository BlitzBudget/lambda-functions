const organizeDate = require('../../../organize/date');
const mockResponse = require('../../fixtures/response/success-without-organization.json');

describe('organizeDate: createParameter', () => {
  test('With Data: Success', () => {
    organizeDate.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Date).not.toBeUndefined();
    expect(mockResponse.Date[0].dateId).not.toBeUndefined();
    expect(mockResponse.Date[0].walletId).not.toBeUndefined();
  });

  test('Without Data: Success', () => {
    const emptyResponse = {
      Date: undefined,
    };
    organizeDate.organize(emptyResponse);
    expect(emptyResponse.Date).toBeUndefined();
  });
});
