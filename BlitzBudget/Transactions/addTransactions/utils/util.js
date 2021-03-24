const Util = () => {};

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

function includesStr(arr, val) {
  return isEmpty(arr) ? null : arr.includes(val);
}

function notIncludesStr(arr, val) {
  return !includesStr(arr, val);
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

function isEqual(obj1, obj2) {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
}

Util.prototype.isEqual = isEqual;
Util.prototype.isNotEmpty = isNotEmpty;
Util.prototype.isEmpty = isEmpty;
Util.prototype.notIncludesStr = notIncludesStr;
Util.prototype.includesStr = includesStr;