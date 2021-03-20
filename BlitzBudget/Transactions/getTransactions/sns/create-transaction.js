const CreateTransaction = () => {};

const util = require('../utils/util');
const snsParameter = require('../create-parameter/sns');

async function markTransactionForCreation(recurringTransaction, sns) {
  let { description } = recurringTransaction;
  function fetchTagValue() {
    return util.isEmpty(recurringTransaction.tags) ? [] : recurringTransaction.tags;
  }

  const currentTag = fetchTagValue();

  function fetchDescription() {
    if (util.isEmpty(recurringTransaction.description)) {
      description = 'No description';
    }
  }

  console.log(
    'Marking the recurring transaction for creation %j',
    recurringTransaction.sk,
  );

  fetchDescription();

  const params = snsParameter.createParameter(recurringTransaction, description, currentTag);

  const response = await sns.publish(params).promise();
  return response;
}

CreateTransaction.prototype.markTransactionForCreation = markTransactionForCreation;
// Export object
module.exports = new CreateTransaction();
