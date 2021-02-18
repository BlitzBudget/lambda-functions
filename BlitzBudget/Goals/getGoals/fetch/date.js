const FetchDate = () => {};

FetchDate.prototype.getDateData = function getDateData(
  pk,
  startsWithDate,
  endsWithDate,
  docClient,
) {
  function organizeRetrivedItems(data) {
    console.log('data retrieved - Date ', data.Count);
    if (data.Items) {
      Object.keys(data.Items).forEach((dateObj) => {
        const date = dateObj;
        date.dateId = dateObj.sk;
        date.walletId = dateObj.pk;
        delete date.sk;
        delete date.pk;
      });
    }
  }

  function createParameter() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':bt1': `Date#${startsWithDate}`,
        ':bt2': `Date#${endsWithDate}`,
      },
      ProjectionExpression: 'pk, sk, income_total, expense_total, balance',
    };
  }

  const params = createParameter();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        organizeRetrivedItems(data);
        resolve({
          Date: data.Items,
        });
      }
    });
  });
};

// Export object
module.exports = new FetchDate();
