const util = require('../../../utils/util');

describe('isEmpty', () => {
  test('With Data: Success', () => {
    expect(util.isEmpty('en')).toBe(false);
    expect(util.isEmpty(1)).toBe(false);
    expect(util.isEmpty(true)).toBe(false);
    expect(util.isEmpty({
      notempty: true,
    })).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(util.isEmpty('')).toBe(true);
    expect(util.isEmpty(null)).toBe(true);
    expect(util.isEmpty({})).toBe(true);
  });
});

describe('fetchFirstAndFamilyName', () => {
  test('With Special Characters', () => {
    const name = util.fetchFirstAndFamilyName('nagarjun_nagesh');
    expect(name.surname).toBe('Nagesh');
    expect(name.username).toBe('Nagarjun');
  });

  test('Without Special Characters', () => {
    const name = util.fetchFirstAndFamilyName('nagarjunnagesh');
    expect(name.surname).toBe(' ');
    expect(name.username).toBe('Nagarjunnagesh');
  });

  test('Special Characters in First Place: without family name', () => {
    const name = util.fetchFirstAndFamilyName('_nagarjun');
    expect(name.surname).toBe(' ');
    expect(name.username).toBe('Nagarjun');
  });

  test('Special Characters in First Place: with family name', () => {
    const name = util.fetchFirstAndFamilyName('_nagarjun_nagesh');
    expect(name.surname).toBe('Nagesh');
    expect(name.username).toBe('Nagarjun');
  });
});
