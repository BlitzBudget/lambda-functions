// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("updating goals for ", JSON.stringify(event['body-json']));
    await updatingGoals(event).then(function(result) {
       console.log("successfully saved the new goals");
    }, function(err) {
       throw new Error("Unable to add the goals " + err);
    });
        
    return event;
};

function updatingGoals(event) {
  
    let updateExp = "set";
    let expAttrVal = {};
    let expAttrNames = {};
    
    if(isEmpty(event['body-json'])) {
      return;
    }
  
    // Set Goal Type
    if(isNotEmpty(event['body-json'].goalType)) {
      updateExp += ' #variable1 = :v1';
      expAttrVal[':v1'] = "goal_type";
      expAttrNames['#variable1'] = event['body-json'].goalType;
    }
    
    // Set Final Amount
    if(isNotEmpty(event['body-json'].targetAmount)) {
      updateExp += ' #variable2 = :v2';
      expAttrVal[':v2'] = "final_amount";
      expAttrNames['#variable2'] = event['body-json'].targetAmount;
    }
    
    // Set Target Date
    if(isNotEmpty(event['body-json'].targetId)) {
      updateExp += ' #variable3 = :v3';
      expAttrVal[':v3'] = "target_id";
      expAttrNames['#variable3'] = event['body-json'].targetId;
    }
    
    // Set Target Date
    if(isNotEmpty(event['body-json'].targetId)) {
      updateExp += ' #variable4 = :v4';
      expAttrVal[':v4'] = "target_type";
      expAttrNames['#variable4'] = event['body-json'].targetType;
    }
    
        
    var params = {
      TableName:'goals',
      Key: {
        "financial_portfolio_id": event['body-json'].financialPortfolioId,
        "goal_timestamp": event['body-json'].goalId,
      },
      UpdateExpression: updateExp,
      ExpressionAttributeNames: expAttrVal,
      ExpressionAttributeValues: expAttrNames
    };
    
    console.log("Updating an item...");
    return new Promise((resolve, reject) => {
      docClient.update(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve({ "success" : data});
            event['body-json'].id= randomValue;
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

    // Check if obj is an element
    if(obj instanceof Element) return false;
      
  return true;
}

function  isNotEmpty(obj) {
  return !isEmpty(obj);
}