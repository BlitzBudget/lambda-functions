const FetchHelper = () => {};
const util = require('./util');
const addHelper = require('./add-helper');
const fetchCategory = require('../fetch/category');

async function fetchOrCreateANewCategory(
  categoryId,
  event,
  today,
  categoryName,
  events,
  documentClient,
) {
  await fetchCategory.getCategoryData(documentClient, event, today).then(
    (result) => {
      if (util.isNotEmpty(result.Category)) {
        console.log(
          'Successfully assigned the existing category %j',
          result.Category.sk,
        );
        // event['body-json'].category = result.Category.sk;
      } else {
        // Assign Category to create the transactions with the category ID
        addHelper.createANewCategory(
          event,
          categoryId,
          categoryName,
          events,
          documentClient,
        );
      }
    },
    (err) => {
      throw new Error(`Unable to add the Budget ${err}`);
    },
  );
}

/*
 * If category Id is not present
 */
async function calculateAndFetchCategory(event, events, documentClient) {
  const categoryName = event['body-json'].category;
  if (
    util.isNotEmpty(categoryName)
    && util.notIncludesStr(categoryName, 'Category#')
  ) {
    const today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(
      parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
    );
    const categoryId = `Category#${today.toISOString()}`;

    /*
     * Check if category is present before adding them
     */
    await fetchOrCreateANewCategory(
      categoryId,
      event,
      today,
      categoryName,
      events,
      documentClient,
    );
  }
}

FetchHelper.prototype.calculateAndFetchCategory = calculateAndFetchCategory;
// Export object
module.exports = new FetchHelper();
