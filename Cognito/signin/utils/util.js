function Util() {}

const constants = require('../constants/constant');

function isEmpty(obj) {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj
&& Object.keys(obj).length !== 0) { return false; }

  // Check if obj is an element
  if (obj instanceof Element) return false;

  return true;
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

const includesStr = (arr, val) => (isEmpty(arr) ? false : arr.includes(val));

Util.prototype.includesStr = includesStr;

Util.prototype.fetchUserId = (response) => {
  let userID;
  if (isNotEmpty(response) && isNotEmpty(response.UserAttributes)) {
    response.UserAttributes.some((userAttributes) => {
      if (includesStr(userAttributes.Name, constants.FINANCIAL_PORTFOLIO_ID)) {
        userID = userAttributes.Value;
        return true;
      }
      return false;
    });
  }
  return userID;
};

Util.prototype.nameKeysAppropriately = (data) => {
  if (isNotEmpty(data) && isNotEmpty(data.Items)) {
    data.Items.forEach((wallet) => {
      const singleWallet = wallet;
      singleWallet.walletId = wallet.sk;
      singleWallet.userId = wallet.pk;
      delete singleWallet.sk;
      delete singleWallet.pk;
    });
  }
  return data.Items;
};

// Export object
module.exports = new Util();
