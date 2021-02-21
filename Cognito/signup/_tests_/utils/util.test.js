const util = require('../../utils/util');

describe('isEmpty', () => {
  test('With Data: Success', () => {
    expect(util.isEmpty('en')).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(util.isEmpty('')).toBe(true);
    expect(util.isEmpty(null)).toBe(true);
  });
});
/*
describe('fetchFirstAndFamilyName', () => {
  test('With Special Characters', () => {
    const name = util.fetchFirstAndFamilyName('nagarjun_nagesh');
    expect(name.familyName).toBe('Nagesh');
    expect(name.firstName).toBe('Nagarjun');
  });

  test('Without Special Characters', () => {
    const name = util.fetchFirstAndFamilyName('nagarjunnagesh');
    expect(name.familyName).toBe(' ');
    expect(name.firstName).toBe('Nagarjunnagesh');
  });

  test('Special Characters in First Place: without family name', () => {
    const name = util.fetchFirstAndFamilyName('_nagarjun');
    expect(name.familyName).toBe(' ');
    expect(name.firstName).toBe('Nagarjun');
  });

  test('Special Characters in First Place: with family name', () => {
    const name = util.fetchFirstAndFamilyName('_nagarjun_nagesh');
    expect(name.familyName).toBe('Nagesh');
    expect(name.firstName).toBe('Nagarjun');
  });
});

describe('isNotEmpty', () => {
  test('With Data: Success', () => {
    expect(util.isNotEmpty('en')).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(util.isNotEmpty('')).toBe(false);
    expect(util.isNotEmpty(null)).toBe(false);
  });
});

describe('splitElement', () => {
  test('With Split Character: Success', () => {
    const names = util.splitElement('Nagarjun_Nagesh', '_');
    expect(names[0]).toBe('Nagarjun');
    expect(names[1]).toBe('Nagesh');
  });

  test('Without Split Character: Success', () => {
    const names = util.splitElement('Nagarjun_Nagesh', '.');
    expect(names).toBe('Nagarjun_Nagesh');
  });

  test('Empty Data: Success', () => {
    const names = util.splitElement('', '.');
    expect(names).toBe('');
  });

  test('Null Data: Success', () => {
    const names = util.splitElement(null, '.');
    expect(names).toBe(null);
  });
});
*/
