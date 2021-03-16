const FetchBudget = () => {};

const helper = require('../utils/helper');
const constants = require('../constants/constant');

// Get Budget Item
FetchBudget.prototype.getBudgetsItem = async (today, event, docClient) => {
  function createParameters() {
    return {
      TableName: constants.TABLE_NAME,
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
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  const response = await docClient.query(params).promise();

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

  return { Budget: matchingBudget };
};

// Export object
module.exports = new FetchBudget();
