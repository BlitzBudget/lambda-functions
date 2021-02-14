var date = function () {};

date.prototype.getDateData = function getDateData(
  pk,
  startsWithDate,
  endsWithDate,
  docClient,
  goalData
) {
  var params = createParameter();

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    docClient.query(params, function (err, data) {
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

  function organizeRetrivedItems(data) {
    console.log('data retrieved - Date ', data.Count);
    if (data.Items) {
      for (const dateObj of data.Items) {
        dateObj.dateId = dateObj.sk;
        dateObj.walletId = dateObj.pk;
        delete dateObj.sk;
        delete dateObj.pk;
      }
    }
    goalData['Date'] = data.Items;
  }

  function createParameter() {
    return {
      TableName: 'blitzbudget',
      KeyConditionExpression: 'pk = :pk and sk BETWEEN :bt1 AND :bt2',
      ExpressionAttributeValues: {
        ':pk': pk,
        ':bt1': 'Date#' + startsWithDate,
        ':bt2': 'Date#' + endsWithDate,
      },
      ProjectionExpression: 'pk, sk, income_total, expense_total, balance',
    };
  }
};

// Export object
module.exports = new date();
