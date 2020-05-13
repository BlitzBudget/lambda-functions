// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
const parameters = [{
  "prmName" : "currency",
  "prmValue" : 'currency'
},
{
  "prmName" : "name",
  "prmValue" : 'wallet_name'
}
]

exports.handler = async (event) => {
    console.log("updating goals for ", JSON.stringify(event['body-json']));
    await updatingItem(event).then(function(result) {
       console.log("successfully saved the new goals");
    }, function(err) {
       throw new Error("Unable to save the changes to the wallet " + err);
    });
        
    return event;
};

function updatingItem(event) {
  
    let updateExp = "set";
    let expAttrVal = {};
    let expAttrNames = {};
    
    if(isEmpty(event['body-json'])) {
      return;
    }
    
    
    for(let i=0, len = parameters.length; i < len; i++) {
      
      let prm = parameters[i];
      
      
      // If the parameter is not found then do not save
      if(isEmpty(event['body-json'][prm.prmName])) {
        continue;
      }
      
      // Add a comma to update expression
      if(includesStr(updateExp , '#variable')) {
        updateExp += ',';
      }
      
      console.log('param name - ' + event['body-json'][prm.prmName]);
      
      updateExp += ' #variable' + i + ' = :v' + i;
      expAttrVal[':v' + i] = event['body-json'][prm.prmName];
      expAttrNames['#variable' + i] = prm.prmValue;
    }
    
    console.log(" update expression ", JSON.stringify(updateExp), " expression attribute value ", JSON.stringify(expAttrVal), ' expression Attribute Names ', JSON.stringify(expAttrNames));
    if(isEmpty(expAttrVal)) {
      return;
    }

    updateExp += ', #update = :u';
    expAttrVal[':u'] = new Date().toISOString();
    expAttrNames['#update'] = 'updated_date';
  
    var params = {
      TableName:'blitzbudget',
      Key: {
        "pk": event['body-json'].userId,
        "sk": event['body-json'].walletId,
      },
      UpdateExpression: updateExp,
      ExpressionAttributeNames: expAttrNames,
      ExpressionAttributeValues: expAttrVal
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

function includesStr(arr, val){
  return isEmpty(arr) ? null : arr.includes(val); 
}
