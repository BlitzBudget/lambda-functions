const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

var sns = new AWS.SNS();

exports.handler = async (event) => {
    let response = {};
    let params = {
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      ConfirmationCode: event['body-json'].confirmationCode, /* required */
      Username: event['body-json'].username, /* required */
    };
    
    await confirmSignUp(params).then(function(result) {}, function(err) {
       throw new Error("Unable to confirm signup from cognito  " + err);
    });
    
    let loginParams = {
      AuthFlow:  'USER_PASSWORD_AUTH',
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      AuthParameters: {
          USERNAME: event['body-json'].username,
          PASSWORD: event['body-json'].password
      }
    };
    
    await initiateAuth(loginParams).then(function(result) {
       response = result;
    }, function(err) {
       throw new Error("Unable to login from cognito  " + err);
    });
    
    await getUser(response).then(function(result) {
       response.Username = result.Username;
       response.UserAttributes = result.UserAttributes;
       console.log("logged in the user " + JSON.stringify(result.Username));
    }, function(err) {
       throw new Error("Unable to signin from cognito  " + err);
    });

    /*
    * Get locale to currency
    */
    let currenyChosen = localeToCurrency[event.params.header['CloudFront-Viewer-Country']];
    /*
    * If chosen currency is empty then revert to Dollars
    */
    currenyChosen = isEmpty(currenyChosen) ? '$' : currenyChosen;
    console.log("Fetching the country header from cloudfront ", currenyChosen);
    await addWalletThroughSNS(response.UserAttributes, currenyChosen).then(function(result) {}, function(err) {
      throw new Error("Unable to add new wallet" + err);
    });
    
    return response;
};

function addWalletThroughSNS(userAttributes, currency) {
    let financialPortfolioId = '';
    for(let i = 0, len = userAttributes.length; i < len; i++) {
      let attribute = userAttributes[i];
      
      if(isEqual(attribute.Name, 'custom:financialPortfolioId')) {
        financialPortfolioId = attribute.Value;
        break;
      }
    }

    let params = {
        Message: financialPortfolioId,
        MessageAttributes: {
            "currency": {
                "DataType": "String",
                "StringValue": currency
            }
        },
        TopicArn: 'arn:aws:sns:eu-west-1:064559090307:addWallet'
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

function confirmSignUp(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.confirmSignUp(params, function(err, data) {  
          if (err) {
              console.log(err, err.stack); // an error occurred
              reject(err);
          }
          else {
              console.log(data);           // successful response
              resolve(data);
          }
        });
    });
}

function initiateAuth(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.initiateAuth(params, function(err, data) {
          if (err) {
              console.log(err, err.stack); // an error occurred
              reject(err);
          }
          else {
              console.log(data);           // successful response
              resolve(data);
          }
        });
    });
}

function getUser(response) {
    let params = {
      AccessToken: response.AuthenticationResult.AccessToken /* required */
    };

    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.getUser(params, function(err, data) {
          if (err) {
              console.log(err, err.stack); // an error occurred
              reject(err);
          }
          else {
              console.log(data);           // successful response
              resolve(data);
          }
        });
    });
}

function isEqual(obj1,obj2){
  if (JSON.stringify(obj1) === JSON.stringify(obj2)) {
      return true;
  }
  return false;
}

function isEmpty(obj) {
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

let localeToCurrency = {};
localeToCurrency['AI'] = '$';
localeToCurrency['AM'] = '֏';
localeToCurrency['AO'] = 'Kz';
localeToCurrency['AR'] = '$';
localeToCurrency['AT'] = '€';
localeToCurrency['AU'] = '$';
localeToCurrency['AW'] = 'ƒ';
localeToCurrency['AX'] = '€';
localeToCurrency['BA'] = 'KM';
localeToCurrency['BE'] = '€';
localeToCurrency['BG'] = 'Лв.';
localeToCurrency['BI'] = 'FBu';
localeToCurrency['BM'] = '$';
localeToCurrency['BN'] = 'B$';
localeToCurrency['BO'] = 'Bs';
localeToCurrency['BR'] = 'R$';
localeToCurrency['CC'] = '$';
localeToCurrency['CF'] = 'FCFA';
localeToCurrency['CH'] = 'Fr';
localeToCurrency['CL'] = '$';
localeToCurrency['CN'] = '¥';
localeToCurrency['CU'] = '$';
localeToCurrency['CX'] = 'AU$';
localeToCurrency['DM'] = 'RD$';
localeToCurrency['EC'] = '$';
localeToCurrency['EE'] = '€';
localeToCurrency['ES'] = '€';
localeToCurrency['EH'] = '₧';
localeToCurrency['ET'] = 'Br';
localeToCurrency['FI'] = '€';
localeToCurrency['FJ'] = 'FJ$';
localeToCurrency['FM'] = '$';
localeToCurrency['FO'] = 'Kr.';
localeToCurrency['GB'] = '£';
localeToCurrency['GD'] = '$';
localeToCurrency['GE'] = 'ლ';
localeToCurrency['GH'] = 'GH₵';
localeToCurrency['GI'] = '£';
localeToCurrency['GP'] = '€';
localeToCurrency['GQ'] = 'FCFA';
localeToCurrency['GT'] = 'GTQ';
localeToCurrency['HN'] = 'L';
localeToCurrency['HR'] = 'kn';
localeToCurrency['HT'] = 'G';
localeToCurrency['ID'] = 'Rp';
localeToCurrency['IN'] = '₹';
localeToCurrency['IO'] = 'US$';
localeToCurrency['IQ'] = 'ع.د';
localeToCurrency['IT'] = '€';
localeToCurrency['JP'] = '円';
localeToCurrency['KG'] = 'Лв';
localeToCurrency['KR'] = '₩';
localeToCurrency['LI'] = 'CHF';
localeToCurrency['LT'] = 'Lt';
localeToCurrency['LV'] = 'Ls';
localeToCurrency['LY'] = 'ل.د';
localeToCurrency['MC'] = '€';
localeToCurrency['ME'] = '€';
localeToCurrency['MF'] = 'ƒ';
localeToCurrency['MG'] = 'Ar';
localeToCurrency['MN'] = '₮';
localeToCurrency['MO'] = 'MOP$';
localeToCurrency['MT'] = '€';
localeToCurrency['MX'] = 'Mex$';
localeToCurrency['NE'] = 'CFA';
localeToCurrency['NF'] = '$';
localeToCurrency['NG'] = '₦';
localeToCurrency['NI'] = 'C$';
localeToCurrency['NP'] = 'रू';
localeToCurrency['PE'] = 'S/';
localeToCurrency['PK'] = 'Rp';
localeToCurrency['PM'] = '€';
localeToCurrency['PS'] = 'E£';
localeToCurrency['PT'] = '€';
localeToCurrency['PY'] = '₲';
localeToCurrency['RO'] = 'lei';
localeToCurrency['RS'] = 'din';
localeToCurrency['SC'] = 'SRe';
localeToCurrency['SD'] = 'ج.س.';
localeToCurrency['SE'] = 'kr';
localeToCurrency['SJ'] = 'kr.';
localeToCurrency['SK'] = 'Sk';
localeToCurrency['SL'] = 'Le';
localeToCurrency['SN'] = 'CFA';
localeToCurrency['SO'] = 'Sh.so.';
localeToCurrency['SX'] = 'ƒ';
localeToCurrency['TG'] = 'CFA';
localeToCurrency['TH'] = '฿';
localeToCurrency['TL'] = '$';
localeToCurrency['TM'] = 'T';
localeToCurrency['UA'] = '₴';
localeToCurrency['US'] = '$';
localeToCurrency['UZ'] = "so'm";
localeToCurrency['VA'] = "€";
localeToCurrency['VC'] = "$";
localeToCurrency['VI'] = "$";
localeToCurrency['VN'] = "₫";
localeToCurrency['VU'] = "VT";
localeToCurrency['WS'] = 'WS$';
localeToCurrency['YE'] = '﷼.';
localeToCurrency['ZA'] = 'R';
