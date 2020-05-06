// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});
var sns = new AWS.SNS();

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();
// Concurrently call multiple APIs and wait for the response 
let events = [];
  

exports.handler = async (event) => {
    console.log( 'event ' + JSON.stringify(event.Records[0]));
    let financialPortfolioId = event.Records[0].Sns.Message;
    let deleteParams = {};
    
    await getAllItems(financialPortfolioId).then(function(result) {
       console.log("successfully fetched all the wallets ", result);
       deleteParams = buildParamsForDelete(result, financialPortfolioId);
    }, function(err) {
       throw new Error("Unable to delete the goals " + err);
    });
    
    if(isEmpty(deleteParams)) {
        return event;
    }
    
    // Publish to SNS and delete all financial portfolio entries
    events.push(deleteItems(deleteParams));
    await Promise.all(events).then(function(result) {
       console.log("successfully deleted the goals");
    }, function(err) {
       throw new Error("Unable to delete the goals " + err);
    });
        
    return event;
};

function buildParamsForDelete(result, financialPortfolioId) {
    if(isEmpty(result.Items)){
        return;
    }
    
    let params = {};
    params.RequestItems = {};
    params.RequestItems.blitzbudget = [];
    
    
    for(let i = 0, len = result.Items.length; i < len; i++) {
        let item = result.Items[i];
        let sk = item['sk'];
        params.RequestItems.blitzbudget[i] = { 
                    "DeleteRequest": { 
                       "Key": {
                           "pk": financialPortfolioId,
                           "sk": sk
                       }
                    }
                 };
                 
        // If wallet item  then push to SNS
        if(includesStr(sk, 'Wallet#')) {
            events.push(publishToResetAccountsSNS(sk));   
        }
    }
    
    return params;
}

// Get goal Item
function getAllItems(financialPortfolioId) {
    var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :financialPortfolioId",
      ExpressionAttributeValues: {
          ":financialPortfolioId": financialPortfolioId
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
            resolve({ "success" : data});
          }
        });
    });
}

function  isEmpty(obj) {
  // Check if objext is a number or a boolean
  if(typeof(obj) == 'number' || typeof(obj) == 'boolean') return false; 
  
  // Check if obj is null or undefined
  if (obj == null || obj === undefined) return true;
  
  // Check if the length of the obj is defined
  if(typeof(obj.length) != 'undefined') return obj.length == 0;
   
  // check if obj is a custom obj
  for(let key in obj) {
        if(obj.hasOwnProperty(key))return false;
    }

  return true;
}


function includesStr(arr, val){
  return isEmpty(arr) ? null : arr.includes(val); 
}

function publishToResetAccountsSNS(item) {
    var params = {
        Message: item,
        MessageAttributes: {
            "delete_one_wallet": {
                "DataType": "String",
                "StringValue": "execute"
            },
            "delete_all_items_in_wallet": {
                "DataType": "String",
                "StringValue": "execute"
            }
        },
        TopicArn: 'arn:aws:sns:eu-west-1:064559090307:ResetAccountSubscriber'
    };
    
    return new Promise((resolve, reject) => {
        sns.publish(params,  function(err, data) {
            if (err) {
                console.log("Error ", err);
                reject(err);
            } else {
                resolve( "Reset account to SNS published");
            }
        }); 
    });
}