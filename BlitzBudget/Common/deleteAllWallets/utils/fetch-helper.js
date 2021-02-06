var fetchHelper = function () { };

const deleteHelper = require('delete-helper');

// Get goal Item
function getAllItems(userId, DB) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :userId",
      ExpressionAttributeValues: {
          ":userId": userId
      },
      ProjectionExpression: "sk"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        DB.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved ", JSON.stringify(data.Items));
            resolve(data);
          }
        });
    });
}


async function fetchAllItemsToDelete(userId, deleteParams, sns, DB, events) {
    await getAllItems(userId, DB).then(function (result) {
        console.log("successfully fetched all the wallets ", result);
        deleteParams = deleteHelper.buildParamsForDelete(result, userId, sns, events);
    }, function (err) {
        throw new Error("Unable to delete the goals " + err);
    });
    return deleteParams;
}

fetchHelper.prototype.fetchAllItemsToDelete = fetchAllItemsToDelete;

// Export object
module.exports = new fetchHelper();