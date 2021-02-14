var helper = function () {};

function isEmpty(obj) {
  // Check if objext is a number or a boolean
  if (typeof obj == 'number' || typeof obj == 'boolean') return false;

  // Check if obj is null or undefined
  if (obj == null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length != 'undefined') return obj.length == 0;

  // check if obj is a custom obj
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }

  return true;
}

function includesStr(arr, val) {
  return isEmpty(arr) ? null : arr.includes(val);
}

function isEqual(obj1, obj2) {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
}

function isNotEqual(obj1, obj2) {
  return !isEqual(obj1, obj2);
}

helper.prototype.isNotEqual = isNotEqual;
helper.prototype.isEmpty = isEmpty;
helper.prototype.isEqual = isEqual;
helper.prototype.includesStr = includesStr;
// Export object
module.exports = new helper();
