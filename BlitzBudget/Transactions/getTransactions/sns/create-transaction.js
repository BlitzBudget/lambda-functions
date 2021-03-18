const CreateTransaction = () => {};

const helper = require('../utils/helper');

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

  function createParameterForSns() {
    return {
      Message: recurringTransaction.sk,
      MessageAttributes: {
        category: {
          DataType: 'String',
          StringValue: recurringTransaction.category,
        },
        next_scheduled: {
          DataType: 'String',
          StringValue: recurringTransaction.next_scheduled,
        },
        amount: {
          DataType: 'String',
          StringValue: recurringTransaction.amount.toString(),
        },
        recurrence: {
          DataType: 'String',
          StringValue: recurringTransaction.recurrence,
        },
        description: {
          DataType: 'String',
          StringValue: description,
        },
        account: {
          DataType: 'String',
          StringValue: recurringTransaction.account,
        },
        categoryType: {
          DataType: 'String',
          StringValue: recurringTransaction.category_type,
        },
        categoryName: {
          DataType: 'String',
          StringValue: recurringTransaction.category_name,
        },
        walletId: {
          DataType: 'String',
          StringValue: recurringTransaction.pk,
        },
        tags: {
          DataType: 'String.Array',
          StringValue: JSON.stringify(currentTag),
        },
      },
      TopicArn: 'arn:aws:sns:eu-west-1:064559090307:addRecurringTransactions',
    };
  }

  console.log(
    'Marking the recurring transaction for creation %j',
    recurringTransaction.sk,
  );

  fetchDescription();

  const params = createParameterForSns();

  const response = await sns.publish(params).promise();
  return response;
}

CreateTransaction.prototype.markTransactionForCreation = markTransactionForCreation;
// Export object
module.exports = new CreateTransaction();
