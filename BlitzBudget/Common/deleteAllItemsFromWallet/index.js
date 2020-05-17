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
    let params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = [];
    let processBatchDelete;
    for(let i = 0, len = result.Items.length; i < len; i++) {
        processBatchDelete = false;
        let item = result.Items[i];
        
        if(params.RequestItems.blitzbudget.length < 25) {
            console.log("Building the delete params for the item %j", item.sk);
             params.RequestItems.blitzbudget[i] = { 
                    "DeleteRequest": { 
                       "Key": {
                           "pk": walletId,
                           "sk": item.sk
                       }
                    }
                 };
                 
                 /*
                 * If last iteration is running then
                 */
                 if(i == (len -1)) {
                     processBatchDelete = true;
                 }
        } else {
           processBatchDelete = true;
        }
        
        if(processBatchDelete) {
            console.log("Deleting a batch of %j items", params.RequestItems.blitzbudget.length);
            await deleteItems(params).then(function(result) {
               console.log("successfully deleted all the items");
                params = {};
                params.RequestItems = {};
                params.RequestItems.blitzbudget = [];
            }, function(err) {
               throw new Error("Unable to delete all the items " + err);
            });   
        }
    }
        
    return event;
};

// Get goal Item
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

