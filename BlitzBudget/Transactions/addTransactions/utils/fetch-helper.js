function FetchHelper() {}

const util = require('./util');
const date = require('../fetch/date');
const category = require('../fetch/category');

async function fetchDate(event, today, documentClient) {
  let dateMeantFor;
  await date.getDateData(event['body-json'].walletId, today, documentClient).then(
    (result) => {
      if (util.isNotEmpty(result.Date)) {
        dateMeantFor = result.Date.sk;
      }
    },
    (err) => {
      throw new Error(`Unable to add the date ${err}`);
    },
  );
  return dateMeantFor;
}

async function fetchCategory(event, today, documentClient) {
  let categoryId;
  await category.getCategoryData(event, today, documentClient).then(
    (result) => {
      if (util.isNotEmpty(result.Category)) {
        categoryId = result.Category.sk;
      }
    },
    (err) => {
      throw new Error(`Unable to get the category ${err}`);
    },
  );
  return categoryId;
}

FetchHelper.prototype.fetchDate = fetchDate;
FetchHelper.prototype.fetchCategory = fetchCategory;
// Export object
module.exports = new FetchHelper();
