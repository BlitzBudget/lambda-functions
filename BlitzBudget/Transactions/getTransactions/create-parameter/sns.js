module.exports.createParameter = (recurringTransaction, description, currentTag) => ({
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
});
