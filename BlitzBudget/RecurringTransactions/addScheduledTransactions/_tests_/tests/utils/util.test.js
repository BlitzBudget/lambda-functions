const util = require('../../../utils/util');

describe('isEmpty', () => {
  test('With Data: Success', () => {
    expect(util.isEmpty('en')).toBe(false);
    expect(util.isEmpty(1)).toBe(false);
    expect(util.isEmpty(true)).toBe(false);
  });

  test('Without Data: Success', () => {
    expect(util.isEmpty('')).toBe(true);
    expect(util.isEmpty(null)).toBe(true);
    expect(util.isEmpty({})).toBe(true);
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

describe('notIncludesStr', () => {
  test('With Data: Success', () => {
    expect(util.notIncludesStr(['en', 'es'], 'es')).toBe(false);
    expect(util.notIncludesStr('falstru', 'tru')).toBe(false);
    expect(util.notIncludesStr('falstru', 'tr')).toBe(false);
  });

  test('With False Data: Success', () => {
    expect(util.notIncludesStr(['en', 'es'], 'e')).toBe(true);
    expect(util.notIncludesStr(['false', 'true'], 'tru')).toBe(true);
    expect(util.notIncludesStr(['fals', 'tru'], 'true')).toBe(true);
  });

  test('Without Data: Success', () => {
    expect(util.notIncludesStr(['en', 'es'], '')).toBe(true);
    expect(util.notIncludesStr([], 'en')).toBe(true);
  });
});

describe('chunkArrayInGroups', () => {
  const array = [0, 1, 2, 3, 4, 5, 6, 7, 7, 8, 9, 0];
  test('With Data: Success', () => {
    const splittedArray = util.chunkArrayInGroups(array, 2);
    expect(splittedArray).not.toBeUndefined();
    expect(splittedArray.length).not.toBeUndefined();
    expect(splittedArray.length).toBe(6);
  });

  test('Without Data: Success', () => {
    const splittedArray = util.chunkArrayInGroups([], 2);
    expect(splittedArray).not.toBeUndefined();
    expect(splittedArray.length).not.toBeUndefined();
    expect(splittedArray.length).toBe(0);
  });
});
