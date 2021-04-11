const util = require('../../../utils/util');

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
