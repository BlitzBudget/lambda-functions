// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'eu-west-1'});

// Create the DynamoDB service object
var DB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    let pk = isNotEmpty(event.Records) ? event.Records[0].Sns.Subject : event.params.querystring.financialPortfolioId;
    let sk = isNotEmpty(event.Records) ? event.Records[0].Sns.Message : event.params.querystring.itemId;
    console.log( 'pk ', pk, ' sk ', sk);
    await deleteOneItem(pk, sk).then(function(result) {
       console.log("successfully deleted the goals");
    }, function(err) {
       throw new Error("Unable to delete the goals " + err);
    });
        
    return event;
};


function deleteOneItem(pk, sk) {
    console.log('financial Portfolio Id selected for deletion is ' + pk);
    
    var params = {
        "TableName": 'blitzbudget', 
        "Key" : {
            "pk": pk,
            "sk": sk 
        }
    }
        
    return new Promise((resolve, reject) => {
        DB.delete(params, function(err, data) {
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

function isNotEmpty(obj) {
    return !isEmpty(obj)
}