const FetchDate = () => {};

const dateParameter = require('../create-parameter/date');

FetchDate.prototype.getDateData = async function getDateData(
  pk,
  startsWithDate,
  endsWithDate,
  documentClient,
) {
  function organizeRetrivedItems(data) {
    console.log('data retrieved - Date ', data.Count);
    if (data.Items) {
      data.Items.forEach((dateObj) => {
        const date = dateObj;
        date.dateId = dateObj.sk;
        date.walletId = dateObj.pk;
        delete date.sk;
        delete date.pk;
      });
    }
  }

  const params = dateParameter.createParameter(pk, startsWithDate, endsWithDate);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();

  organizeRetrivedItems(response);
  return {
    Date: response.Items,
  };
};

// Export object
module.exports = new FetchDate();
