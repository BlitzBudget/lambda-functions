const organizeDate = require('../../../organize/date');
const mockResponse = require('../../fixtures/response/successWithoutOrganization.json');

describe('organizeDate: createParameter', () => {
  test('With Data: Success', () => {
    organizeDate.organize(mockResponse, [], true);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Date).not.toBeUndefined();
    expect(mockResponse.Date[0].dateId).not.toBeUndefined();
    expect(mockResponse.Date[0].walletId).not.toBeUndefined();
  });
});
