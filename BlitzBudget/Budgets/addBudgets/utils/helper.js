const Helper = () => {};

const extractVariablesFromRequest = (event) => {
  const { walletId } = event['body-json'];
  const { dateMeantFor } = event['body-json'];
  return {
    walletId,
    dateMeantFor,
  };
};

const isEmpty = (obj) => {
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
};

const isNotEmpty = (obj) => !isEmpty(obj);

const isEqual = (obj1, obj2) => {
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
    return true;
  }
  return false;
};

/*
 * If dateMeantFor, category, planned is empty
 */
const throwErrorIfEmpty = (event, walletId) => {
  if (isEmpty(event['body-json'].dateMeantFor)) {
    console.log('The date is mandatory for adding an account %j', walletId);
    throw new Error('Unable to add the transaction as date is mandatory');
  } else if (isEmpty(event['body-json'].category)) {
    console.log('The category is mandatory for adding an account %j', walletId);
    throw new Error('Unable to add the transaction as category is mandatory');
  } else if (isEmpty(event['body-json'].planned)) {
    console.log(
      'The planned balance is mandatory for adding an account %j',
      walletId,
    );
    throw new Error(
      'Unable to add the transaction as planned balance is mandatory',
    );
  }
};

function includesStr(arr, val) {
  return isEmpty(arr) ? null : arr.includes(val);
}

function notIncludesStr(arr, val) {
  return !includesStr(arr, val);
}

const isNotEqual = (obj1, obj2) => !isEqual(obj1, obj2);

Helper.prototype.isEmpty = isEmpty;
Helper.prototype.isNotEmpty = isNotEmpty;
Helper.prototype.isEqual = isEqual;
Helper.prototype.isNotEqual = isNotEqual;
Helper.prototype.notIncludesStr = notIncludesStr;
Helper.prototype.throwErrorIfEmpty = throwErrorIfEmpty;
Helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;

Helper.prototype.convertToDate = (event) => {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  return today;
};

// Export object
module.exports = new Helper();
