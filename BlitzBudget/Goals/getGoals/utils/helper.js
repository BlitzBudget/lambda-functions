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

Helper.prototype.isNotEmpty = (obj) => !isEmpty(obj);

Helper.prototype.extractVariablesFromRequest = (event) => {
  const { userId } = event['body-json'];
  // Twelve months ago
  const today = new Date();
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  twelveMonthsAgo.setDate(1);
  const oneYearAgo = twelveMonthsAgo.toISOString();
  return {
    userId, oneYearAgo, today,
  };
};

Helper.prototype.isEmpty = isEmpty;

// Export object
module.exports = new Helper();
