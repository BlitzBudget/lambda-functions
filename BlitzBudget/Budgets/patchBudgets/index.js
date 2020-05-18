// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
const parameters = [{
  "prmName" : "category",
  "prmValue" : 'category'
},
{
  "prmName" : "planned",
  "prmValue" : 'planned'
}
]

exports.handler = async (event) => {
    console.log("updating Budgets for ", JSON.stringify(event['body-json']));
    let events = [];
    
    /*
    * If category Id is not present
    */
    let categoryName = event['body-json'].category;
    if(isNotEmpty(categoryName) && notIncludesStr(categoryName, 'Category#')) {
      let today = new Date();
      today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
      today.setMonth(parseInt(event['body-json'].dateMeantFor.substring(10, 12)) -1);
      let categoryId = "Category#" + today.toISOString();
      
      /*
      * Check if category is present before adding them
      */
      await getCategoryData(categoryId, event, today).then(function(result) {
        if(isNotEmpty(result.Category)) {
          console.log("successfully assigned the existing category %j", result.Category.sk);
          event['body-json'].category = result.Category.sk;
        } else {
          // Assign Category to create the transactions with the category ID
          event['body-json'].category = categoryId;
          event['body-json'].categoryName = categoryName;
          // If it is a newly created category then the category total is 0
          event['body-json'].used = 0;
          events.push(createCategoryItem(event, categoryId, categoryName));
        }
      }, function(err) {
         throw new Error("Unable to add the Budget " + err);
      });
    }
    
    events.push(updatingBudgets(event));
    
    await Promise.all(events).then(function(result) {
       console.log("successfully saved the existing Budgets");
    }, function(err) {
       throw new Error("Unable to add the Budgets " + err);
    });
        
    return event;
};

function updatingBudgets(event) {
  
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
        "pk": event['body-json'].walletId,
        "sk": event['body-json'].budgetId,
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

function createCategoryItem(event, skForCategory, categoryName) {
    
    var params = {
        TableName:'blitzbudget',
        Key:{
          "pk": event['body-json'].walletId,
          "sk": skForCategory,
        },
        UpdateExpression: "set category_total = :r, category_name = :p, category_type = :q, date_meant_for = :s, creation_date = :c, updated_date = :u",
        ExpressionAttributeValues:{
            ":r": 0,
            ":p": categoryName,
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

function getCategoryData(categoryId, event, today) {
  var params = {
      TableName: 'blitzbudget',
      KeyConditionExpression   : "pk = :pk AND begins_with(sk, :items)",
      ExpressionAttributeValues: {
          ":pk": event['body-json'].walletId,
          ":items": "Category#" + today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2)
      },
      ProjectionExpression: "pk, sk, category_name, category_type"
    };
    
    // Call DynamoDB to read the item from the table
    return new Promise((resolve, reject) => {
        docClient.query(params, function(err, data) {
          if (err) {
            console.log("Error ", err);
            reject(err);
          } else {
            console.log("data retrieved - Category %j", data.Count);
            let obj = data.items;
            if(isNotEmpty(data.Items)) {
              for(const categoryObj of data.Items) {
                if(isEqual(categoryObj['category_type'],event['body-json'].categoryType) 
                && isEqual(categoryObj['category_name'],event['body-json'].category)) {
                    console.log("Found a match for the mentioned category %j", categoryObj.sk);
                    obj = categoryObj;
                }
              }
            } else {
              console.log("There are no categories assigned");
            }
            
            resolve({ "Category" : obj}); 
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

function includesStr(arr, val){
  return isEmpty(arr) ? null : arr.includes(val); 
}

function notIncludesStr(arr, val){
  return !includesStr(arr, val); 
}

function isEqual(obj1,obj2){
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true;
  }
  return false;
}