function CreateTransaction() {}

const util = require('../utils/util');
const snsParameter = require('../create-parameter/sns');

function fetchTagValue(recurringTransaction) {
  return util.isEmpty(recurringTransaction.tags) ? [] : recurringTransaction.tags;
}

function fetchDescription(recurringTransaction, description) {
  let desc = description;
  if (util.isEmpty(recurringTransaction.description)) {
    desc = 'No description';
  }

  return desc;
}

async function markTransactionForCreation(recurringTransaction, sns) {
  const { description } = recurringTransaction;
  const currentTag = fetchTagValue(recurringTransaction);

  console.log(
    'Marking the recurring transaction for creation %j',
    recurringTransaction.sk,
  );

  const desc = fetchDescription(recurringTransaction, description);
  const params = snsParameter.createParameter(recurringTransaction, desc, currentTag);
  const response = await sns.publish(params).promise();
  return response;
}

CreateTransaction.prototype.markTransactionForCreation = markTransactionForCreation;
// Export object
module.exports = new CreateTransaction();
