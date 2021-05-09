function FetchHelper() {}
const util = require('./util');
const category = require('../fetch/category');

async function fetchCategory(event, today, documentClient) {
  let categoryId;
  await category.getCategoryData(documentClient, event, today).then(
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

FetchHelper.prototype.fetchCategory = fetchCategory;
// Export object
module.exports = new FetchHelper();
