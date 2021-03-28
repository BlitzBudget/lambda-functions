const fetchCategory = require('../fetch/category.js');
const addHelper = require('./add-helper');
const util = require('./util');

const fetchCategoryIdIfNotProvided = async (
  event,
  today,
  events,
) => {
  let isBudgetPresent = true;
  const categoryName = event['body-json'].category;
  if (
    util.isNotEmpty(categoryName)
      && util.notIncludesStr(categoryName, 'Category#')
  ) {
    const categoryId = `Category#${today.toISOString()}`;

    await fetchCategory.getCategoryData(categoryId, event, today).then(
      (result) => {
        if (util.isNotEmpty(result.Category)) {
          console.log(
            'successfully assigned the existing category %j',
            result.Category.sk,
          );
        } else {
          isBudgetPresent = addHelper.createANewCategoryItem(
            event,
            categoryId,
            categoryName,
            events,
          );
        }
      },
      (err) => {
        throw new Error(`Unable to get the category ${err}`);
      },
    );
  }
  return { categoryName, isBudgetPresent };
};

module.exports.calculateAndFetchCategory = async (
  today,
  event,
  events,
) => {
  const { categoryName, isBudgetPresent } = await fetchCategoryIdIfNotProvided(
    event,
    today,
    events,
  );
  return { categoryName, isBudgetPresent };
};
