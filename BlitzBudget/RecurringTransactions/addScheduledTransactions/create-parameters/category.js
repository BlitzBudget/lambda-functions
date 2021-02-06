/*
 * Build Parameters for category
 */
function buildParamsForCategory(pk, sk, categoryType, categoryName, dateMeantFor) {
    console.log("Creating the category with an sk %j", sk, " And with a date as ", dateMeantFor, " for the wallet ", pk);
    return {
        "PutRequest": {
            "Item": {
                "pk": pk,
                "sk": sk,
                "category_total": 0,
                "category_name": categoryName,
                "category_type": categoryType,
                "date_meant_for": dateMeantFor,
                "creation_date": new Date().toISOString(),
                "updated_date": new Date().toISOString()
            }
        }
    }
}