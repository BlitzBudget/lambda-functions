const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/withDateAndCategory.json');

describe('formulateDateFromRequest', () => {
  test('With Data: Success', () => {
    const today = helper.formulateDateFromRequest(mockRequest);
    expect(today.getMonth()).toBe(4);
    expect(today.getFullYear()).toBe(2020);
  });
});
