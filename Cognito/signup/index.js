const AWS = require('aws-sdk')
const helper = require('helper');
AWS.config.update({
    region: 'eu-west-1'
});
let cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();

exports.handler = async (event) => {
    console.log("The event is ", JSON.stringify(event));
    let accepLan = JSON.stringify(event.params.header['Accept-Language']);
    let firstName = event['body-json'].firstname;
    let lastName = event['body-json'].lastname;
    let email = event['body-json'].username.toLowerCase().trim();

    if(helper.isEmpty(firstName) && helper.isEmpty(lastName)) {
        // Set Name
        let fullName = fetchFirstElement(splitElement(email, '@'));
        let name = fetchFirstAndFamilyName(fullName);
        firstName = name.firstName;
        lastName = name.familyName;
    }

    let response = {};
    let params = {
        ClientId: '2ftlbs1kfmr2ub0e4p15tsag8g',
        /* required */
        Password: event['body-json'].password,
        /* required */
        Username: email,
        /* required */
        UserAttributes: [
            {
                Name: 'email',
                /* required */
                Value: email
        },
            {
                Name: 'name',
                /* required */
                Value: firstName
        },
            {
                Name: 'family_name',
                /* required */
                Value: lastName
        },
            {
                Name: 'locale',
                /* required */
                Value: (accepLan.length <= 4) ? accepLan.substring(1, 3) : accepLan.substring(1, 6) /* take en or en-US if available */
        },
            {
                Name: 'custom:financialPortfolioId',
                /* required */
                Value: "User#" + new Date().toISOString()
        },
            {
                Name: 'custom:exportFileFormat',
                /* required */
                Value: 'XLS'
        }
        /* more items */
      ],
    };

    await signUp(params).then(function (result) {
        response = result;
    }, function (err) {
        throw new Error("Unable to signin from cognito  " + err);
    });


    return response;
};

function signUp(params) {
    return new Promise((resolve, reject) => {
        cognitoidentityserviceprovider.signUp(params, function (err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
                reject(err);
            } else {
                console.log(data); // successful response
                resolve(data);
            }
        });
    });
}

// Calculate First Name and Last Name
function fetchFirstAndFamilyName(fullName) {
    let possibleSym = /[!#$%&'*+-\/=?^_`{|}~]/;
    let name = {};
    let matchFound = fullName.match(possibleSym);

    if (isNotEmpty(matchFound)) {
        let nameArr = splitElement(fullName, matchFound);
        let firstName = nameArr[0];
        let familyName = nameArr[1]

        // If First Name is empty then assign family name to first name
        if (helper.isEmpty(firstName)) {
            firstName = familyName;
            familyName = nameArr.length > 2 ? nameArr[2] : ' ';
        }

        // First Letter Upper case
        firstName = firstName.length > 1 ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : firstName.charAt(0).toUpperCase();
        familyName = helper.isEmpty(familyName) ? ' ' : (familyName.length > 1 ? familyName.charAt(0).toUpperCase() + familyName.slice(1) : familyName.charAt(0).toUpperCase());

        name['firstName'] = firstName;
        name['familyName'] = familyName;

    } else {
        // First Letter Upper case
        fullName = helper.isEmpty(fullName) ? '' : (fullName.length > 1 ? fullName.charAt(0).toUpperCase() + fullName.slice(1) : fullName.charAt(0).toUpperCase());
        name['firstName'] = fullName;
        name['familyName'] = ' ';
    }

    /*
     * Family name
     */
    if (helper.isEmpty(name['familyName'])) {
        name['familyName'] = ' ';
    }

    return name;
}

function isNotEmpty(obj) {
    return !helper.isEmpty(obj);
}

function splitElement(str, splitString) {
    if (includesStr(str, splitString)) {
        return helper.isEmpty(str) ? str : str.split(splitString);
    }

    return str;
}
