const FetchHelper = () => {};

const util = require('./util');
const createDate = require('../add/date');
const fetchDate = require('../fetch/date');
const fetchCategory = require('../fetch/category');
const createCategory = require('../add/category');

/*
 * If Date Id is not present
 */
async function calculateAndFetchDate(event, walletId, events, documentClient) {
  let { dateMeantFor } = event['body-json'];
  if (util.notIncludesStr(dateMeantFor, 'Date#')) {
    const today = new Date(event['body-json'].dateMeantFor);
    /*
     * Check if date is present before adding them
     */
    await fetchDate.getDateData(walletId, today, documentClient).then(
      (result) => {
        if (util.isNotEmpty(result.Date)) {
          console.log('successfully assigned the exissting date %j', result.Date[0].sk);
          dateMeantFor = result.Date[0].sk;
        } else {
          dateMeantFor = `Date#${today.toISOString()}`;
          console.log('Date entry is empty so creating the date object');
          events.push(createDate.createDateData(event, dateMeantFor));
        }
        // Assign Date meant for to create the transactions with the date ID
        // event['body-json'].dateMeantFor = dateMeantFor;
      },
      (err) => {
        throw new Error(`Unable to add the Budget ${err}`);
      },
    );
  }
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
    await fetchCategory
      .getCategoryData(categoryId, event, today, documentClient)
      .then(
        (result) => {
          if (util.isNotEmpty(result.Category)) {
            console.log('successfully assigned the existing category %j', result.Category.sk);
            // event['body-json'].category = result.Category.sk;
          } else {
            const categoryParam = event['body-json'];
            // Assign Category to create the transactions with the category ID
            categoryParam.category = categoryId;
            categoryParam.categoryName = categoryName;
            events.push(
              createCategory.createCategoryItem(categoryParam, categoryId, categoryName),
            );
          }
        },
        (err) => {
          throw new Error(`Unable to get the category ${err}`);
        },
      );
  }
}

FetchHelper.prototype.calculateAndFetchDate = calculateAndFetchDate;
FetchHelper.prototype.calculateAndFetchCategory = calculateAndFetchCategory;
// Export object
module.exports = new FetchHelper();
