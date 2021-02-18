const FetchBudget = () => {};

const helper = require('../utils/helper');

// Get Budget Item
FetchBudget.prototype.getBudgetsItem = (today, event, docClient) => {
  const params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': event['body-json'].walletId,
      ':items':
        `Budget#${
          today.getFullYear()
        }-${
          (`0${today.getMonth() + 1}`).slice(-2)}`,
    },
    ProjectionExpression: 'category, date_meant_for, sk, pk',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved - Budget', data.Count);
        let matchingBudget;
        if (helper.isNotEmpty(data.Items)) {
          Object.keys(data.Items).forEach((budgetItem) => {
            if (
              helper.isEqual(budgetItem.category, event['body-json'].category)
              && helper.isEqual(
                budgetItem.date_meant_for,
                event['body-json'].dateMeantFor,
              )
            ) {
              console.log(
                'Matching budget found with the same date and category %j',
                budgetItem.sk,
              );
              matchingBudget = budgetItem;
            }
          });
        }

        resolve({
          Budget: matchingBudget,
        });
      }
    });
  });
};

module.exports = new FetchBudget();
