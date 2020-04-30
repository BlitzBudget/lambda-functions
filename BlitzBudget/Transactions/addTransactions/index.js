// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding goals for ", JSON.stringify(event['body-json']));
    
    let categoryName = event['body-json'].category;
    if(notIncludesStr(categoryName, 'Category#')) {
      await createCategoryItem(event).then(function(result) {
         console.log("successfully created a new category %j", result.sk);
         event['body-json'].category = result.sk;
      }, function(err) {
         throw new Error("Unable to add the category " + err);
      });
    }
    
    await addNewTransaction(event).then(function(result) {
       console.log("successfully saved the new transaction");
    }, function(err) {
       throw new Error("Unable to add the transactions " + err);
    });
        
    return event;
};

function createCategoryItem(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) -1);
    let randomValue = "Category#" + today.toISOString(); 
    
    var params = {
        TableName:'blitzbudget',
        Key:{
          "pk": event['body-json'].walletId,
          "sk": randomValue,
        },
        UpdateExpression: "set category_total = :r, category_name = :p",
        ExpressionAttributeValues:{
            ":r": 0,
            ":p": event['body-json'].category
        },
        ReturnValues: 'ALL_NEW'
    }
    
    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
      docClient.update(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            resolve(data.Attributes);
          }
      });
    });
}

function addNewTransaction(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) -1);
    let randomValue = "Transaction#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": event['body-json'].walletId,
            "sk": randomValue,
            "amount": event['body-json'].amount,
            "description": event['body-json'].description,
            "category": event['body-json'].category,
            "recurrence": event['body-json'].recurrence,
            "account": event['body-json'].account,
            "date": event['body-json'].dateMeantFor
      }
    };
    
    console.log("Adding a new item...");
    return new Promise((resolve, reject) => {
      docClient.put(params, function(err, data) {
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

function notIncludesStr(arr, val) {
  return !includesStr(arr, val);
}

function includesStr(arr, val){
  return isEmpty(arr) ? null : arr.includes(val); 
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