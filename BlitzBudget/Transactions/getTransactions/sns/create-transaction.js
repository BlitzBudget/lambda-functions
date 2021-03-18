const CreateTransaction = () => {};

const helper = require('../utils/helper');
const snsParameter = require('../create-parameter/sns');

async function markTransactionForCreation(recurringTransaction, sns) {
  let { description } = recurringTransaction;
  function fetchTagValue() {
    return helper.isEmpty(recurringTransaction.tags) ? [] : recurringTransaction.tags;
  }

  const currentTag = fetchTagValue();

  function fetchDescription() {
    if (helper.isEmpty(recurringTransaction.description)) {
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
