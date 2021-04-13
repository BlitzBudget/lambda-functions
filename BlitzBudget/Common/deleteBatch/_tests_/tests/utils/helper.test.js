const util = require('../../../utils/helper');
const mockRequest = require('../../fixtures/request/deleteBatch');

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

describe('noItemsInRequest', () => {
  test('Without Data: Success', () => {
    const isNotPresent = util.noItemsInRequest([]);
    expect(isNotPresent).not.toBeUndefined();
    expect(isNotPresent).toBe(true);
  });

  test('With Data: Success', () => {
    const isNotPresent = util.noItemsInRequest([1]);
    expect(isNotPresent).not.toBeUndefined();
    expect(isNotPresent).toBe(false);
  });
});

describe('extractVariablesFromRequest', () => {
  test('Without Data: Success', () => {
    const response = util.extractVariablesFromRequest(mockRequest);
    expect(response).not.toBeUndefined();
    expect(response.walletId).not.toBeUndefined();
    expect(response.result.length).toBe(13);
  });
});
