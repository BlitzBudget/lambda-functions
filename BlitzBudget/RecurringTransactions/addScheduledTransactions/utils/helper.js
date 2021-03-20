const Helper = () => {};

// Splits array into chunks
function chunkArrayInGroups(arr, size) {
  const myArray = [];
  for (let i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i + size));
  }
  return myArray;
}

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

Helper.prototype.chunkArrayInGroups = chunkArrayInGroups;

// Export object
module.exports = new Helper();
