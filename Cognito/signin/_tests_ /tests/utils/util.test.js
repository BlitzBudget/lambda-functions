const util = require('../../../utils/util');
const mockUser = require('../../fixtures/response/get-user');
const mockWalletResponse = require('../../fixtures/response/wallet');

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

describe('fetchUserId', () => {
  test('With Data: Success', () => {
    const userId = util.fetchUserId(mockUser);
    expect(userId).not.toBeUndefined();
    expect(userId).toBe(mockUser.UserAttributes[2].Value);
  });

  test('With False Data: Success', () => {
    const userId = util.fetchUserId({});
    expect(userId).toBeUndefined();
  });

  test('Without Data: Success', () => {
    const userId = util.fetchUserId({ UserAttributes: {} });
    expect(userId).toBeUndefined();
  });
});

describe('nameKeysAppropriately', () => {
  test('With Data: Success', () => {
    const response = util.nameKeysAppropriately(mockWalletResponse);
    expect(response).not.toBeUndefined();
    expect(response[0].walletId).not.toBeUndefined();
    expect(response[0].userId).not.toBeUndefined();
    expect(response[0].pk).toBeUndefined();
    expect(response[0].sk).toBeUndefined();
  });

  test('With False Data: Success', () => {
    const response = util.nameKeysAppropriately({});
    expect(response).toBeUndefined();
  });

  test('Without Data: Success', () => {
    const response = util.nameKeysAppropriately({ Items: [] });
    expect(response).not.toBeUndefined();
    expect(response.length).toBe(0);
  });
});
