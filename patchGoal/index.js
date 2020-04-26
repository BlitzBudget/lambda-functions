// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
const parameters = {
  'goalType' : 'goal_type',
  'finalAmount' : 'final_amount',
  'targetId' : 'target_id',
  'targetType' : 'target_type'
}

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
    
    for(let i=0, len = event['body-json'].length; i < len; i++) {
      let prm = event['body-json'][i];
      
      // If the parameter is not found then do not save
      if(isEmpty(parameters[prm])) {
        continue;
      }
      
      updateExp += ' #variable' + i + ' = :v' + i;
      expAttrVal[':v' + i] = parameters[prm];
      expAttrNames['#variable' + i] = prm;
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

function  isNotEmpty(obj) {
  return !isEmpty(obj);
}