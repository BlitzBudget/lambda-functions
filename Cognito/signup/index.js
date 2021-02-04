const AWS = require('aws-sdk')
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

    if(isEmpty(firstName) && isEmpty(lastName)) {
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
        if (isEmpty(firstName)) {
            firstName = familyName;
            familyName = nameArr.length > 2 ? nameArr[2] : ' ';
        }

        // First Letter Upper case
        firstName = firstName.length > 1 ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : firstName.charAt(0).toUpperCase();
        familyName = isEmpty(familyName) ? ' ' : (familyName.length > 1 ? familyName.charAt(0).toUpperCase() + familyName.slice(1) : familyName.charAt(0).toUpperCase());

        name['firstName'] = firstName;
        name['familyName'] = familyName;

    } else {
        // First Letter Upper case
        fullName = isEmpty(fullName) ? '' : (fullName.length > 1 ? fullName.charAt(0).toUpperCase() + fullName.slice(1) : fullName.charAt(0).toUpperCase());
        name['firstName'] = fullName;
        name['familyName'] = ' ';
    }

    /*
     * Family name
     */
    if (isEmpty(name['familyName'])) {
        name['familyName'] = ' ';
    }

    return name;
}


function isEmpty(obj) {
    // Check if objext is a number or a boolean
    if (typeof (obj) == 'number' || typeof (obj) == 'boolean') return false;

    // Check if obj is null or undefined
    if (obj == null || obj === undefined) return true;

    // Check if the length of the obj is defined
    if (typeof (obj.length) != 'undefined') return obj.length == 0;

    // check if obj is a custom obj
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) return false;
    }

    // Check if obj is an element
    if (obj instanceof Element) return false;

    return true;
}

function isNotEmpty(obj) {
    return !isEmpty(obj);
}

function splitElement(str, splitString) {
    if (includesStr(str, splitString)) {
        return isEmpty(str) ? str : str.split(splitString);
    }

    return str;
}
