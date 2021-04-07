function AddHelper() {}

const util = require('./util');
const helper = require('./helper');
const category = require('../fetch/category');
const addCategory = require('../add/category');

async function addNewCategoryIfNotPresent(
  categoryId,
  event,
  today,
  categoryName,
  documentClient,
) {
  const events = [];
  await category.getCategoryData(event, today, documentClient).then(
    (result) => {
      if (util.isNotEmpty(result.Category)) {
        console.log('successfully assigned the existing category %j', result.Category.sk);
        // event['body-json'].category = result.Category.sk;
      } else {
        const createCategory = event['body-json'];
        // Assign Category to create the transactions with the category ID
        createCategory.category = categoryId;
        createCategory.categoryName = categoryName;
        // If it is a newly created category then the category total is 0
        createCategory.used = 0;
        events.push(
          addCategory.createCategoryItem(
            createCategory,
            categoryId,
            categoryName,
            documentClient,
          ),
        );
      }
    },
    (err) => {
      throw new Error(`Unable to get the category ${err}`);
    },
  );
  return { events };
}

/*
 * If category Id is not present
 */
async function addANewCategoryIfNotPresent(
  event,
  documentClient,
) {
  const categoryName = event['body-json'].category;
  let isBudgetPresent = true;
  let events = [];
  if (
    util.isNotEmpty(categoryName)
    && util.notIncludesStr(categoryName, 'Category#')
  ) {
    const today = helper.formulateDateFromRequest(event);
    const categoryId = `Category#${today.toISOString()}`;

    /*
     * Check if category is present before adding them
     */
    events = await addNewCategoryIfNotPresent(
      categoryId,
      event,
      today,
      categoryName,
      documentClient,
    );

    if (events.length !== 0) {
      // Do not check the budget for a newly created category
      isBudgetPresent = false;
    }
  }
  return { categoryName, isBudgetPresent, events };
}

AddHelper.prototype.addANewCategoryIfNotPresent = addANewCategoryIfNotPresent;
// Export object
module.exports = new AddHelper();
