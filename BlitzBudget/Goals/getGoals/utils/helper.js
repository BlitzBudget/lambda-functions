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

helper.prototype.isNotEmpty = (obj) => {
  return !isEmpty(obj);
};

helper.prototype.extractVariablesFromRequest = (event) => {
  let userId = event['body-json'].userId;
  let walletId = event['body-json'].walletId;
  // Twelve months ago
  let today = new Date();
  let twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  twelveMonthsAgo.setDate(1);
  let oneYearAgo = twelveMonthsAgo.toISOString();
  return {walletId, userId, oneYearAgo, today};
};

helper.prototype.isEmpty = isEmpty;

// Export object
module.exports = new helper();
