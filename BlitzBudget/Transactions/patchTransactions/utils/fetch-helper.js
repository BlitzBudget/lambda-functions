function FetchHelper() {}

const util = require('./util');
const category = require('../fetch/category');
const createCategory = require('../add/category');
const helper = require('./helper');

async function fetchCategory(event, today, documentClient) {
  let categoryResponse = {};
  /*
  * Check if category is present before adding them
  */
  await category.getCategoryData(event, today, documentClient).then(
    (response) => {
      console.log(
        'successfully assigned the existing category %j',
        JSON.stringify(response),
      );
      categoryResponse = response;
    },
    (err) => {
      throw new Error(`Unable to add the Category ${err}`);
    },
  );

  return categoryResponse;
}

async function calculateAndFetchCategory(event, events, documentClient) {
  const categoryName = event['body-json'].category;
  let categoryResponse = {};

  if (util.isEmpty(categoryName) || util.includesStr(categoryName, 'Category#')) {
    return categoryResponse;
  }

  const today = helper.formulateDateFromRequest(event);
  const categoryId = `Category#${today.toISOString()}`;
  categoryResponse = await fetchCategory(event, today, documentClient);

  if (util.isEmpty(categoryResponse) || util.isEmpty(categoryResponse.Category)) {
    // Assign Category to create the transactions with the category ID
    events.push(createCategory.createCategoryItem(
      event,
      categoryId,
      categoryName,
      documentClient,
    ));
  }

  return categoryResponse;
}

FetchHelper.prototype.calculateAndFetchCategory = calculateAndFetchCategory;
// Export object
module.exports = new FetchHelper();
