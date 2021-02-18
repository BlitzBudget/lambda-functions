const FetchDate = () => {};

function getDateData(pk, year, docClient) {
  function createParameters() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and begins_with(sk, :items)',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':items': `Date#${year}`,
      },
      ProjectionExpression: 'pk, sk, income_total, expense_total, balance',
    };
  }

  const params = createParameters();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log('data retrieved - Date %j', data.Count);
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
