const helper = require('../../../utils/helper');

describe('isEmpty', () => {
  test('With Data: Success', () => {
    expect(helper.isEmpty('en')).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(helper.isEmpty('')).toBe(true);
    expect(helper.isEmpty(null)).toBe(true);
  });
});

describe('isNotEmpty', () => {
  test('With Data: Success', () => {
    expect(helper.isNotEmpty('en')).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(helper.isNotEmpty('')).toBe(false);
    expect(helper.isNotEmpty(null)).toBe(false);
  });
});
