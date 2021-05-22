function FetchCategory() { }

const fetchDateParameter = require('../create-parameter/fetch-date');

function calculateSortKey(data, today, categoryName, categoryType, category) {
  const sortKeyDate = new Date();
  sortKeyDate.setFullYear(today.substring(0, 4));
  sortKeyDate.setMonth(parseInt(today.substring(5, 7), 10) - 1);
  let sortKey = `Category#${sortKeyDate.toISOString()}`;
  if (data.Count > 0) {
    data.Items.forEach((item) => {
      if (
        item.category_name === categoryName
        && item.category_type === categoryType
      ) {
        sortKey = item.sk;
        console.log('There is a positive match for the category %j', item.sk);
      }
    });
  } else {
    console.log(
      'Since the count is 0 for the month %j',
      today,
      ' sending the originalcategory ',
      category,
    );
  }
  return sortKey;
}

async function getCategoryData(pk, today, categoryType, categoryName, category, documentClient) {
  const params = fetchDateParameter.createParameter(pk, today);

  // Call DynamoDB to read the item from the table
  const response = await documentClient.query(params).promise();
  const sortKey = calculateSortKey(response, today, categoryName, categoryType, category);

  return ({
    sortKey,
    dateMeantFor: today,
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
