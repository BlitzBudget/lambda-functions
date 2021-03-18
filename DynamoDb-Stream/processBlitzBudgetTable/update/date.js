const UpdateDate = () => {};

const constants = require('../constants/constant');

async function updateDateItem(pk, sk, difference, income, expense, docClient) {
  const params = {
    TableName: constants.TABLE_NAME,
    Key: {
      pk,
      sk,
    },
    UpdateExpression:
      'set balance = balance + :ab, income_total = income_total + :it, expense_total = expense_total + :et',
    ConditionExpression: 'attribute_exists(balance)',
    ExpressionAttributeValues: {
      ':ab': difference,
      ':it': income,
      ':et': expense,
    },
    ReturnValues: 'NONE',
  };

  console.log('Updating the item...');

  const response = await docClient.update(params).promise();
  return response;
}

UpdateDate.prototype.updateDateItem = updateDateItem;
// Export object
module.exports = new UpdateDate();
