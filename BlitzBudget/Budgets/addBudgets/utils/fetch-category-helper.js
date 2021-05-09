const fetchCategory = require('../fetch/category.js');
const util = require('./util');

module.exports.fetchCategoryItem = async (event, today, documentClient) => {
  let categoryResponse;
  await fetchCategory.getCategoryData(event, today, documentClient).then(
    (result) => {
      if (util.isNotEmpty(result.Category) && util.isNotEmpty(result.Category[0])) {
        console.log('successfully assigned the existing category %j', result.Category.sk);
      }
      categoryResponse = result;
    },
    (err) => {
      throw new Error(`Unable to get the category ${err}`);
    },
  );
  return categoryResponse;
};
