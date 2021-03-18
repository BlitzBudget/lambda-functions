const FetchDate = () => {};

const dateParameter = require('../create-parameter/date');

async function getDateData(pk, startsWithDate, endsWithDate, documentClient) {
  function organizeRetrievedItems(data) {
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

  const params = dateParameter.createParameters(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeRetrievedItems(response);
  return ({
    Date: response.Items,
  });
}

FetchDate.prototype.getDateData = getDateData;
// Export object
module.exports = new FetchDate();
