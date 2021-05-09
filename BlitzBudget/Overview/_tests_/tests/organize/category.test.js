const organizeDate = require('../../../organize/date');
const mockResponse = require('../../fixtures/response/fetch-category.json');

describe('organizeDate: createParameter', () => {
  test('With Data: Success', () => {
    organizeDate.organize(mockResponse);
    expect(mockResponse).not.toBeUndefined();
    expect(mockResponse.Items).not.toBeUndefined();
    expect(mockResponse.Items[0].dateId).not.toBeUndefined();
    expect(mockResponse.Items[0].walletId).not.toBeUndefined();
  });
});
