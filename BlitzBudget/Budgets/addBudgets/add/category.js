const AddCategory = () => {};

AddCategory.prototype.createCategoryItem = async (
  event,
  skForCategory,
  categoryName,
  docClient,
) => {
  const params = {
    TableName: 'blitzbudget',
    Key: {
      pk: event['body-json'].walletId,
      sk: skForCategory,
    },
    UpdateExpression:
      'set category_total = :r, category_name = :p, category_type = :q, date_meant_for = :s, creation_date = :c, updated_date = :u',
    ExpressionAttributeValues: {
      ':r': 0,
      ':p': categoryName,
      ':q': event['body-json'].categoryType,
      ':s': event['body-json'].dateMeantFor,
      ':c': new Date().toISOString(),
      ':u': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  console.log('Adding a new item...');

  const response = await docClient.update(params).promise();
  return {
    Category: response.Attributes,
  };
};

module.exports = new AddCategory();
