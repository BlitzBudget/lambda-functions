const util = require('../../../utils/util');

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

describe('noItemsPresent', () => {
  test('With Data: Success', () => {
    const splittedArray = util.noItemsPresent({ Count: 0 });
    expect(splittedArray).not.toBeUndefined();
    expect(splittedArray).toBe(true);
  });

  test('With Data: Success', () => {
    const splittedArray = util.noItemsPresent({ Count: 1 });
    expect(splittedArray).not.toBeUndefined();
    expect(splittedArray).toBe(false);
  });
});
