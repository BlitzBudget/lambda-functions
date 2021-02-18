const Helper = () => {};

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

Helper.prototype.includesStr = (arr, val) => (isEmpty(arr) ? null : arr.includes(val));

Helper.prototype.fetchUserId = (response) => {
  let userIdParam;
  Object.keys(response.UserAttributes).forEach((userId) => {
    if (Helper.includesStr(userId.Name, 'custom:financialPortfolioId')) {
      userIdParam = userId.Value;
    }
  });
  return userIdParam;
};

// Export object
module.exports = new Helper();
