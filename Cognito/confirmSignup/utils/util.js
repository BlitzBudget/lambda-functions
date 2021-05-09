function Util() {}

const isEmpty = (obj) => {
  // Check if objext is a number or a boolean
  if (typeof obj === 'number' || typeof obj === 'boolean') return false;

  // Check if obj is null or undefined
  if (obj === null || obj === undefined) return true;

  // Check if the length of the obj is defined
  if (typeof obj.length !== 'undefined') return obj.length === 0;

  // check if obj is a custom obj
  if (obj && Object.keys(obj).length !== 0) { return false; }

  return true;
};

const isNotEmpty = (obj) => !isEmpty(obj);

Util.prototype.isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

Util.prototype.isEmpty = isEmpty;
Util.prototype.isNotEmpty = isNotEmpty;

// Export object
module.exports = new Util();
