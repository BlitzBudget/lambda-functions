const FetchBudget = () => {};

const util = require('../utils/util');
const budgetParameter = require('../create-parameter/budget');

// Get Budget Item
FetchBudget.prototype.getBudgetsItem = async (today, event, documentClient) => {
  const params = budgetParameter.createParameters(today, event);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  let matchingBudget;
  if (util.isNotEmpty(response.Items)) {
    response.Items.forEach((budget) => {
      if (util.isEqual(budget.category, event['body-json'].category)
              && util.isEqual(budget.date_meant_for, event['body-json'].dateMeantFor)) {
        console.log('Matching budget found with the same date and category %j', budget.sk);
        matchingBudget = budget;
      }
    });
  }

  return { Budget: matchingBudget };
};

// Export object
module.exports = new FetchBudget();
