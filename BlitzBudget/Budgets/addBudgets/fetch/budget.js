function FetchBudget() {}

const util = require('../utils/util');
const budgetParameter = require('../create-parameter/budget');

// Get Budget Item
FetchBudget.prototype.getBudgetsItem = async (todayAsDate, event, documentClient) => {
  const params = budgetParameter.createParameter(event, todayAsDate);

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

  return {
    Budget: matchingBudget,
  };
};

module.exports = new FetchBudget();
