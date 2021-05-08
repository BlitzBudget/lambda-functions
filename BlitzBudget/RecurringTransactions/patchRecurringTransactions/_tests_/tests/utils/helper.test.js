const helper = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/patchRecurringTransactionNewCategory.json');

describe('formulateDateFromRequest', () => {
  test('With Data: Success', () => {
    const today = helper.formulateDateFromRequest(mockRequest);
    expect(today.getMonth()).toBe(11);
    expect(today.getFullYear()).toBe(2020);
  });
});
