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

describe('isNotEmpty', () => {
  test('With Data: Success', () => {
    expect(util.isNotEmpty('en')).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(util.isNotEmpty('')).toBe(false);
    expect(util.isNotEmpty(null)).toBe(false);
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
