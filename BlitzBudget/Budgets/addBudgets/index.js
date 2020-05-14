// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var docClient = new AWS.DynamoDB.DocumentClient();
let percentage = 1;

exports.handler = async (event) => {
    console.log("adding Budget for ", JSON.stringify(event['body-json']));
    let events = [];
    percentage = 1;
    let walletId = event['body-json'].walletId;
    let startsWithDate = event['body-json'].startsWithDate;
    let endsWithDate = event['body-json'].endsWithDate;
    let dateMeantFor = event['body-json'].dateMeantFor;
    
    /*
    * Start date and end date is present without datemeantfor
    */
    if(isNotEmpty(startsWithDate) && isNotEmpty(endsWithDate)) {
      console.log("Start date %j ", startsWithDate, " and end date is ", endsWithDate, " are present.");
      if(isFullMonth(startsWithDate, endsWithDate)) {
        event['body-json'].dateMeantFor = startsWithDate;
      } else if(percentage == 1){
        throw new Error("Unable to add the Budget, As the start date and end date must be the same month and year.");
      } else {
        event['body-json'].dateMeantFor = startsWithDate;
        dateMeantFor = startsWithDate;
        event['body-json'].planned *= percentage;
        console.log("Changing the date meant for to %j", event['body-json'].dateMeantFor, " and the planned to ", event['body-json'].planned);
      }
    }

    /*
    * If Date Id is not present
    */
    if(notIncludesStr(dateMeantFor, 'Date#')) {
      console.log("The date is %j", dateMeantFor);
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
            events.push(createDateData(event, dateMeantFor));
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
      let categoryId = "Category#" + today.toISOString();
      // Assign Category to create the transactions with the category ID
      event['body-json'].category = categoryId;
      // If it is a newly created category then the category total is 0
      event['body-json'].used = 0;
      events.push(createCategoryItem(event,categoryId, categoryName));
    }

    events.push(addNewBudget(event));
    await Promise.all(events).then(function(result) {
       console.log("successfully saved the new Budget");
    }, function(err) {
       throw new Error("Unable to add the Budget " + err);
    });
        
    return event;
};

/*
* Calculate difference between startdate and end date
*/
function isFullMonth(startsWithDate, endsWithDate) {
  startsWithDate = new Date(startsWithDate);
  endsWithDate = new Date(endsWithDate);
  
  if(isNotEqual(startsWithDate.getMonth(), endsWithDate.getMonth()) || isNotEqual(startsWithDate.getFullYear(), endsWithDate.getFullYear())) {
    console.log("The month and the year do not coincide"); 
    return false;
  }

  let firstDay = new Date(startsWithDate.getFullYear(), startsWithDate.getMonth());
  let lastDay = new Date(firstDay.getFullYear(), firstDay.getMonth()+1, 0);

  if(isEqual(firstDay.getDate(), startsWithDate.getDate()) && isEqual(lastDay.getDate(), endsWithDate.getDate())) {
    return true;
  }
  
  let periodChosen = endsWithDate.getDate() - startsWithDate.getDate();
  /*
  * If the starts date and end date is the same then. 
  */
  if(periodChosen == 0) {
      console.log("The start date and the end date mentioned are the same");
      periodChosen = 1;
  }
  
  // Calculate oercentage only if the start date and end date is the same month and year, Else the percentage will be applied for all months
  percentage = lastDay.getDate()/periodChosen;
  console.log("Percentage of budget total to be calculated is %j", percentage);
  return false;
}

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
            console.log("data retrieved - Date %j", data.Count);
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
            event['body-json'].budgetId= randomValue;
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

function isEqual(obj1,obj2){
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true;
  }
  return false;
}

function isNotEqual(obj1,obj2){
  return !isEqual(obj1,obj2);
}