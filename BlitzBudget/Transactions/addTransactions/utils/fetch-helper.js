var fetchHelper = function () {};

const helper = require('helper');
const createDate = require('../add/date');
const fetchDate = require('../fetch/date');
const fetchCategory = require('../fetch/category');
const createCategory = require('../add/category');

/*
 * If Date Id is not present
 */
async function calculateAndFetchDate(event, walletId, events, docClient) {
  let dateMeantFor = event['body-json'].dateMeantFor;
  if (helper.notIncludesStr(dateMeantFor, 'Date#')) {
    let today = new Date(event['body-json'].dateMeantFor);
    /*
     * Check if date is present before adding them
     */
    await fetchDate.getDateData(walletId, today, docClient).then(
      function (result) {
        if (helper.isNotEmpty(result.Date)) {
          console.log(
            'successfully assigned the exissting date %j',
            result.Date[0].sk
          );
          dateMeantFor = result.Date[0].sk;
        } else {
          dateMeantFor = 'Date#' + today.toISOString();
          console.log('Date entry is empty so creating the date object');
          events.push(createDate.createDateData(event, dateMeantFor));
        }
        // Assign Date meant for to create the transactions with the date ID
        event['body-json'].dateMeantFor = dateMeantFor;
      },
      function (err) {
        throw new Error('Unable to add the Budget ' + err);
      }
    );
  }
}

/*
 * If category Id is not present
 */
async function calculateAndFetchCategory(event, events, docClient) {
  let categoryName = event['body-json'].category;
  if (
    helper.isNotEmpty(categoryName) &&
    helper.notIncludesStr(categoryName, 'Category#')
  ) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(
      parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1
    );
    let categoryId = 'Category#' + today.toISOString();

    /*
     * Check if category is present before adding them
     */
    await fetchCategory
      .getCategoryData(categoryId, event, today, docClient)
      .then(
        function (result) {
          if (helper.isNotEmpty(result.Category)) {
            console.log(
              'successfully assigned the existing category %j',
              result.Category.sk
            );
            event['body-json'].category = result.Category.sk;
          } else {
            // Assign Category to create the transactions with the category ID
            event['body-json'].category = categoryId;
            event['body-json'].categoryName = categoryName;
            events.push(
              createCategory.createCategoryItem(event, categoryId, categoryName)
            );
          }
        },
        function (err) {
          throw new Error('Unable to get the category ' + err);
        }
      );
  }
}

fetchHelper.prototype.calculateAndFetchDate = calculateAndFetchDate;
fetchHelper.prototype.calculateAndFetchCategory = calculateAndFetchCategory;
// Export object
module.exports = new fetchHelper();
