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

describe('includesStr', () => {
  test('With Data: Success', () => {
    expect(util.includesStr(['en', 'es'], 'es')).toBe(true);
    expect(util.includesStr('falstru', 'tru')).toBe(true);
    expect(util.includesStr('falstru', 'tr')).toBe(true);
  });

  test('With False Data: Success', () => {
    expect(util.includesStr(['en', 'es'], 'e')).toBe(false);
    expect(util.includesStr(['false', 'true'], 'tru')).toBe(false);
    expect(util.includesStr(['fals', 'tru'], 'true')).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(util.includesStr(['en', 'es'], '')).toBe(false);
    expect(util.includesStr([], 'en')).toBe(false);
  });
});

describe('isEqual', () => {
  test('With Data: Success', () => {
    expect(util.isEqual('en', 'en')).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(util.isEqual('')).toBe(false);
    expect(util.isEqual(null)).toBe(false);
    expect(util.isEqual('', '')).toBe(true);
    expect(util.isEqual(null, '')).toBe(false);
    expect(util.isEqual('', null)).toBe(false);
  });

  test('False Data: Success', () => {
    expect(util.isEqual('en', 'e')).toBe(false);
    expect(util.isEqual(null, 'e')).toBe(false);
    expect(util.isEqual('en', null)).toBe(false);
  });
});

describe('isNotEqual', () => {
  test('With Data: Success', () => {
    expect(util.isNotEqual('en', 'en')).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(util.isNotEqual('')).toBe(true);
    expect(util.isNotEqual(null)).toBe(true);
    expect(util.isNotEqual('', '')).toBe(false);
    expect(util.isNotEqual(null, '')).toBe(true);
    expect(util.isNotEqual('', null)).toBe(true);
  });

  test('False Data: Success', () => {
    expect(util.isNotEqual('en', 'e')).toBe(true);
    expect(util.isNotEqual(null, 'e')).toBe(true);
    expect(util.isNotEqual('en', null)).toBe(true);
  });
});
