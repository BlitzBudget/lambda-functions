const FetchDate = () => {};

function getDateData(pk, today, docClient) {
  const params = {
    TableName: 'blitzbudget',
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': pk,
      ':items':
        `Date#${
          today.getFullYear()
        }-${
          (`0${today.getMonth() + 1}`).slice(-2)}`,
    },
    ProjectionExpression: 'pk, sk',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved - Date %j', JSON.stringify(data.Items));
        resolve({
          Date: data.Items,
        });
      }
    });
  });
}

FetchDate.prototype.getDateData = getDateData;
// Export object
module.exports = new FetchDate();
