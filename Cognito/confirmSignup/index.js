const AWS = require('aws-sdk')
AWS.config.update({region: 'eu-west-1'});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    let response = {};
    let params = {
      ClientId: 'l7nmpavlqp3jcfjbr237prqae', /* required */
      ConfirmationCode: event['body-json'].confirmationCode, /* required */
      Username: event['body-json'].username, /* required */
    };
    
    await confirmSignUp(params).then(function(result) {
       response = result;
    }, function(err) {
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
    
    
    return response;
};

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
