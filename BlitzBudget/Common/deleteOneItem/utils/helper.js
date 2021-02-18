const Helper = () => {};

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

const extractVariablesFromRequest = (event) => {
  const fromSns = isNotEmpty(event.Records);
  const pk = fromSns ? event.Records[0].Sns.Subject : event['body-json'].walletId;
  const sk = fromSns ? event.Records[0].Sns.Message : event['body-json'].itemId;
  console.log('pk ', pk, ' sk ', sk);
  return { pk, sk, fromSns };
};

Helper.prototype.extractVariablesFromRequest = extractVariablesFromRequest;

// Export object
module.exports = new Helper();
