var helper = function () {};

let isEmpty = (obj) => {
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
};

let isNotEmpty = (obj) => {
  return !isEmpty(obj);
};

let extractVariablesFromRequest = (event) => {
  let fromSns = isNotEmpty(event.Records);
  let pk = fromSns ? event.Records[0].Sns.Subject : event['body-json'].walletId;
  let sk = fromSns ? event.Records[0].Sns.Message : event['body-json'].itemId;
  console.log('pk ', pk, ' sk ', sk);
  return {pk, sk, fromSns};
};

helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;

// Export object
module.exports = new helper();
