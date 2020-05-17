// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log( 'event ' + JSON.stringify(event.Records[0]));
    let walletId = event.Records[0].Sns.Message;
    let result = {};
    let events = [];
    
    await getAllItems(walletId).then(function(res) {
       console.log("successfully fetched all the items ", res);
       result = res;
    }, function(err) {
       throw new Error("Unable to delete the goals " + err);
    });
    
    if(result.Count == 0) {
        console.log("There are no items to delete for the wallet %j", walletId);
        return event;
    }
    
    console.log("Starting to process the batch delete request for the item for the wallet %j", result.Count);
    let requestArr = [];
    for(const item of result.Items) {
        console.log("Building the delete params for the item %j", item.sk);
        requestArr.push({ 
            "DeleteRequest": { 
               "Key": {
                   "pk": walletId,
                   "sk": item.sk
               }
            }
        });
    }
    
    // Split array into sizes of 25
    let deleteRequests = chunkArrayInGroups(requestArr, 25);
    
    // Push Events  to be executed in bulk
    for(const deleteRequest of deleteRequests) {
        let params = {};
        params.RequestItems = {};
        params.RequestItems.blitzbudget = deleteRequest;
        console.log("The delete request is in batch  with length %j", params.RequestItems.blitzbudget.length);
        // Delete Items in batch
        events.push(deleteItems(params));
    }
    
    
    await Promise.all(events).then(function(result) {
       console.log("successfully deleted all the items");
    }, function(err) {
       throw new Error("Unable to delete all the items " + err);
    });  
        
    return event;
};

// Splits array into chunks
function chunkArrayInGroups(arr, size) {
  var myArray = [];
  for(var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}

// Get all Items
function getAllItems(walletId) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :walletId",
      ExpressionAttributeValues: {
          ":walletId": walletId
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


function deleteItems(params) {
   
    return new Promise((resolve, reject) => {
        DB.batchWrite(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
              console.log("All items are successfully deleted");
            resolve({ "success" : data});
          }
        });
    });
}