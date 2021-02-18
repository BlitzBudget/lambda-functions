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

  return true;
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

function extractVariablesFromRequest(event) {
  const { userId } = event['body-json'];
  const { currency } = event['body-json'];
  const { walletName } = event['body-json'];
  return { userId, currency, walletName };
}

Helper.prototype.isEmpty = isEmpty;
Helper.prototype.isNotEmpty = isNotEmpty;
Helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;
// Export object
module.exports = new Helper();
