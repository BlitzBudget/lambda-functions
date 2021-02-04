var helper = function () { };

helper.prototype.isEmpty = (obj) => {
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

// Calculate First Name and Last Name
helper.prototype.fetchFirstAndFamilyName = (fullName) => {
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

helper.prototype.isNotEmpty = (obj) => {
    return !helper.isEmpty(obj);
}

helper.prototype.splitElement = (str, splitString) => {
    if (includesStr(str, splitString)) {
        return helper.isEmpty(str) ? str : str.split(splitString);
    }

    return str;
}

helper.prototype.buildParamForSignup = (event, email, firstName, lastName, accepLan)  => {
    return {
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
        ],
    };
}

helper.prototype.extractFirstAndLastName = (firstName, lastName, email) => {
    if (helper.isEmpty(firstName) && helper.isEmpty(lastName)) {
        // Set Name
        let fullName = helper.fetchFirstElement(helper.splitElement(email, '@'));
        let name = helper.fetchFirstAndFamilyName(fullName);
        firstName = name.firstName;
        lastName = name.familyName;
    }
    return { firstName, lastName };
}

helper.prototype.emailToLowerCase = (event) => {
    return event['body-json'].username.toLowerCase().trim();
}

function includesStr(arr, val){
    return helper.isEmpty(arr) ? null : arr.includes(val); 
}

// Export object
module.exports = new helper();