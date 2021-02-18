const Helper = () => {};

function isEmpty(obj) {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj && Object.keys(obj).length !== 0) { return false; }

  return true;
}

function isNotEmpty(obj) {
  return !isEmpty(obj);
}

function includesStr(arr, val) {
  return isEmpty(arr) ? null : arr.includes(val);
}

function notIncludesStr(arr, val) {
  return !includesStr(arr, val);
}

function isEqual(obj1, obj2) {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
}

Helper.prototype.isEmpty = isEmpty;
Helper.prototype.isNotEmpty = isNotEmpty;
Helper.prototype.isEqual = isEqual;
Helper.prototype.includesStr = includesStr;
Helper.prototype.notIncludesStr = notIncludesStr;

Helper.prototype.formulateDateFromRequest = (event) => {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  return today;
};

// Export object
module.exports = new Helper();
