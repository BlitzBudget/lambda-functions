/*
* If category Id is not present
*/
async function calculateAndFetchCategory(event, events, docClient) {
    let categoryName = event['body-json'].category;
    if (isNotEmpty(categoryName) && notIncludesStr(categoryName, 'Category#')) {
        let today = new Date();
        today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
        today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
        let categoryId = "Category#" + today.toISOString();

        /*
         * Check if category is present before adding them
         */
        await fetchOrCreateANewCategory(categoryId, event, today, categoryName, events, docClient);
    }
}

async function fetchOrCreateANewCategory(categoryId, event, today, categoryName, events, docClient) {
    await getCategoryData(docClient, event, today).then(function (result) {
        if (isNotEmpty(result.Category)) {
            console.log("Successfully assigned the existing category %j", result.Category.sk);
            event['body-json'].category = result.Category.sk;
        } else {
            // Assign Category to create the transactions with the category ID
            createANewCategory(event, categoryId, categoryName, events, docClient);
        }
    }, function (err) {
        throw new Error("Unable to add the Budget " + err);
    });
}
