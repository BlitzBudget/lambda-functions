const FetchCategory = () => {};

const constants = require('../constants/constant');

/*
 * Get Category Data
 */
function getCategoryData(pk, today, categoryType, categoryName, category, DB) {
  function calculateSortKey(data) {
    const sortKeyDate = new Date();
    sortKeyDate.setFullYear(today.substring(0, 4));
    sortKeyDate.setMonth(parseInt(today.substring(5, 7), 10) - 1);
    let sortKey = `Category#${sortKeyDate.toISOString()}`;
    if (data.Count > 0) {
      Object.keys(data.Items).forEach((item) => {
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

  const params = {
    TableName: constants.TABLE_NAME,
    KeyConditionExpression: 'pk = :pk AND begins_with(sk, :items)',
    ExpressionAttributeValues: {
      ':pk': pk,
      ':items':
        `Category#${today.substring(0, 4)}-${today.substring(5, 7)}`,
    },
    ProjectionExpression: 'pk, sk, category_name, category_type',
  };

  // Call DynamoDB to read the item from the table
  return new Promise((resolve, reject) => {
    DB.query(params, (err, data) => {
      if (err) {
        console.log('Error ', err);
        reject(err);
      } else {
        console.log(
          'data retrieved - Category %j',
          data.Count,
          ' for the date ',
          today,
        );
        /*
         * Create a new sortkey is necessary
         */
        const sortKey = calculateSortKey(data);

        resolve({
          sortKey,
          dateMeantFor: today,
        });
      }
    });
  });
}

FetchCategory.prototype.getCategoryData = getCategoryData;
// Export object
module.exports = new FetchCategory();
