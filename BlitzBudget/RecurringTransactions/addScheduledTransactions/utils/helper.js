function Helper() {}

const util = require('./util');

Helper.prototype.extractVariablesFromRequest = (event) => {
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  const category = event.Records[0].Sns.MessageAttributes.category.Value;
  const categoryType = event.Records[0].Sns.MessageAttributes.categoryType.Value;
  const categoryName = event.Records[0].Sns.MessageAttributes.categoryName.Value;
  const recurringTransactionsId = event.Records[0].Sns.Message;
  console.log(
    `Creating transactions via recurring transactions for the walletId ${
      walletId}`,
  );
  return {
    walletId,
    category,
    categoryType,
    categoryName,
    recurringTransactionsId,
  };
};

Helper.prototype.extractVariablesFromRequestForTransaction = (event) => {
  const recurrence = event.Records[0].Sns.MessageAttributes.recurrence.Value;
  const walletId = event.Records[0].Sns.MessageAttributes.walletId.Value;
  const amount = parseInt(event.Records[0].Sns.MessageAttributes.amount.Value, 10);
  const description = event.Records[0].Sns.MessageAttributes.description.Value;
  const account = event.Records[0].Sns.MessageAttributes.account.Value;
  let tags = event.Records[0].Sns.MessageAttributes.tags.Value;

  if (util.isNotEmpty(tags)) {
    tags = JSON.parse(tags);
    console.log('The tags for the transaction is ', tags);
  }

  const futureDateToCreate = event.Records[0].Sns.MessageAttributes.next_scheduled.Value;
  const today = new Date();
  return {
    futureDateToCreate,
    today,
    walletId,
    recurrence,
    amount,
    description,
    account,
    tags,
  };
};

Helper.prototype.convertToDate = (date) => {
  const dateToCreate = new Date();
  dateToCreate.setFullYear(date.dateToCreate.substring(0, 4));
  const month = parseInt(date.dateToCreate.substring(5, 7), 10) - 1;
  dateToCreate.setMonth(month);
  return dateToCreate;
};

// Export object
module.exports = new Helper();
