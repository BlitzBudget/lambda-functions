const AddDate = () => {};

AddDate.prototype.createDateData = (event, skForDate, docClient) => {
  const params = {
    TableName: 'blitzbudget',
    Key: {
      pk: event['body-json'].walletId,
      sk: skForDate,
    },
    UpdateExpression:
      'set income_total = :r, expense_total=:p, balance=:a, creation_date = :c, updated_date = :u',
    ExpressionAttributeValues: {
      ':r': 0,
      ':p': 0,
      ':a': 0,
      ':c': new Date().toISOString(),
      ':u': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };

  console.log('Adding a new item...');
  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('successfully created a new date %j', data.Attributes.sk);
        resolve({
          Date: data.Attributes,
        });
      }
    });
  });
};

module.exports = new AddDate();
