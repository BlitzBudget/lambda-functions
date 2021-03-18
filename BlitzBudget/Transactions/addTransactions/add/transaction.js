const AddTransaction = () => {};

async function addNewTransaction(event, documentClient) {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  const randomValue = `Transaction#${today.toISOString()}`;

  function createParameters() {
    return {
      TableName: 'blitzbudget',
      Item: {
        pk: event['body-json'].walletId,
        sk: randomValue,
        amount: event['body-json'].amount,
        description: event['body-json'].description,
        category: event['body-json'].category,
        recurrence: event['body-json'].recurrence,
        account: event['body-json'].account,
        date_meant_for: event['body-json'].dateMeantFor,
        tags: event['body-json'].tags,
        creation_date: today.toISOString(),
        updated_date: new Date().toISOString(),
      },
    };
  }

  const params = createParameters();

  console.log('Adding a new item...');

  const response = await documentClient.put(params).promise();
  return {
    success: response,
    transactionId: randomValue,
  };
}

AddTransaction.prototype.addNewTransaction = addNewTransaction;
// Export object
module.exports = new AddTransaction();
