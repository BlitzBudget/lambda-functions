const FetchBudget = () => {};

const helper = require('../utils/helper');
const budgetParameter = require('../create-parameter/budget');

// Get Budget Item
FetchBudget.prototype.getBudgetsItem = async (today, event, documentClient) => {
  const params = budgetParameter.createParameter(event, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  let matchingBudget;
  if (helper.isNotEmpty(response.Items)) {
    Object.keys(response.Items).forEach((budget) => {
      if (helper.isEqual(budget.category, event['body-json'].category)
              && helper.isEqual(budget.date_meant_for, event['body-json'].dateMeantFor)) {
        console.log('Matching budget found with the same date and category %j', budget.sk);
        matchingBudget = budget;
      }
    });
  }

  return {
    Budget: matchingBudget,
  };
};

module.exports = new FetchBudget();
