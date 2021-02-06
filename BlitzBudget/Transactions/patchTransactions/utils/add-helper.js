
function addCategoryItem(event, categoryId, categoryName, events) {
    event['body-json'].category = categoryId;
    event['body-json'].categoryName = categoryName;
    // If it is a newly created category then the category total is 0
    event['body-json'].used = 0;
    events.push(createCategoryItem(event, categoryId, categoryName));
}

