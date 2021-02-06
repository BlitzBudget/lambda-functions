async function calculateAndFetchCategory(event, events) {
    let categoryName = event['body-json'].category;
    if (isNotEmpty(categoryName) && notIncludesStr(categoryName, 'Category#')) {
        let today = new Date();
        today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
        today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) - 1);
        let categoryId = "Category#" + today.toISOString();

        /*
         * Check if category is present before adding them
         */
        await getCategoryData(categoryId, event, today).then(function (result) {
            if (isNotEmpty(result.Category)) {
                console.log("successfully assigned the existing category %j", result.Category.sk);
                event['body-json'].category = result.Category.sk;
            } else {
                // Assign Category to create the transactions with the category ID
                addCategoryItem(event, categoryId, categoryName, events);
            }
        }, function (err) {
            throw new Error("Unable to add the Budget " + err);
        });
    }
}
