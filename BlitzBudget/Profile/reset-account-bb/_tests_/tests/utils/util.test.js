const util = require('../../../utils/util');

describe('isNotEmpty', () => {
  test('With Data: Success', () => {
    expect(util.isNotEmpty('en')).toBe(true);
    expect(util.isNotEmpty(1)).toBe(true);
    expect(util.isNotEmpty(true)).toBe(true);
    expect(util.isNotEmpty({
      sk: 2,
    })).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(util.isNotEmpty('')).toBe(false);
    expect(util.isNotEmpty(null)).toBe(false);
    expect(util.isNotEmpty({})).toBe(false);
  });
});
