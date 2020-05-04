// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log("adding Budget for ", JSON.stringify(event['body-json']));
    let events = [];
    let walletId = event['body-json'].walletId;

    /*
    * If Date Id is not present
    */
    let dateMeantFor = event['body-json'].dateMeantFor;
    if(notIncludesStr(dateMeantFor, 'Date#')) {
        let today = new Date(event['body-json'].dateMeantFor);
        /*
        * Check if date is present before adding them
        */
        await getDateData(walletId, today).then(function(result) {
          if(isNotEmpty(result.Date)) {
            console.log("successfully assigned the exissting date %j", result.Date[0].sk);
            dateMeantFor = result.Date[0].sk;
          } else {
            dateMeantFor = "Date#" + today.toISOString();
            console.log("Date entry is empty so creating the date object");
            events.push(createDateData(walletId, dateMeantFor));
          }
          // Assign Date meant for to create the transactions with the date ID
          event['body-json'].dateMeantFor = dateMeantFor;
        }, function(err) {
           throw new Error("Unable to add the Budget " + err);
        });
    }
    
    /*
    * If category Id is not present
    */
    let categoryName = event['body-json'].category;
    if(notIncludesStr(categoryName, 'Category#')) {
      let today = new Date();
      today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
      today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) -1);
      categoryName = "Category#" + today.toISOString();
      // Assign Category to create the transactions with the category ID
      event['body-json'].category = categoryName; 
      events.push(createCategoryItem(event,categoryName));
    }

    events.push(addNewBudget(event));
    await Promise.all(events).then(function(result) {
       console.log("successfully saved the new Budget");
    }, function(err) {
       throw new Error("Unable to add the Budget " + err);
    });
        
    return event;
};

function getDateData(pk, today) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk AND begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":pk": pk,
          ":items": "Date#" + today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2)
      },
      ProjectionExpression: "pk, sk"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Date %j", JSON.stringify(data.Items));
            resolve({ "Date" : data.Items});
          }
        });
    });
}

function createDateData(event, skForDate) {
  
  var params = {
      TableName:'blitzbudget',
      Key:{
        "pk": event['body-json'].walletId,
        "sk": skForDate,
      },
      UpdateExpression: "set income_total = :r, expense_total=:p, balance=:a, creation_date = :c, updated_date = :u",
      ExpressionAttributeValues:{
          ":r":0,
          ":p":0,
          ":a":0,
          ":c": new Date().toISOString(),
          ":u": new Date().toISOString()
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
          console.log("successfully created a new date %j", data.Attributes.sk);
          event['body-json'].dateMeantFor = data.Attributes.sk;
          resolve({ "Date" : data.Attributes});
        }
    });
  });
  
}

function createCategoryItem(event, skForCategory) {
    
    var params = {
        TableName:'blitzbudget',
        Key:{
          "pk": event['body-json'].walletId,
          "sk": skForCategory,
        },
        UpdateExpression: "set category_total = :r, category_name = :p, category_type = :q, date_meant_for = :s, creation_date = :c, updated_date = :u",
        ExpressionAttributeValues:{
            ":r": 0,
            ":p": event['body-json'].category,
            ":q": event['body-json'].categoryType,
            ":s": event['body-json'].dateMeantFor,
            ":c": new Date().toISOString(),
            ":u": new Date().toISOString()
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
            console.log("Successfully created a new category %j", data.Attributes.sk)
            event['body-json'].category = data.Attributes.sk;
            resolve({ "Category" : data.Attributes});
          }
      });
    });
}

function addNewBudget(event) {
    let today = new Date();
    today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
    today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) -1);
    let randomValue = "Budget#" + today.toISOString(); 
        
    var params = {
      TableName:'blitzbudget',
      Item:{
            "pk": event['body-json'].walletId,
            "sk": randomValue,
            "category": event['body-json'].category,
            "planned": event['body-json'].planned,
            "auto_generated": false,
            "date_meant_for": event['body-json'].dateMeantFor,
            "creation_date": new Date().toISOString(),
            "updated_date": new Date().toISOString()
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

function includesStr(arr, val){
  return isEmpty(arr) ? null : arr.includes(val); 
}

function notIncludesStr(arr, val){
  return !includesStr(arr, val); 
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

function isNotEmpty(obj) {
  return !isEmpty(obj);
}