const helper = require('helper');
const signup = require('signup');

exports.handler = async (event) => {
    console.log("The event is ", JSON.stringify(event));

    let accepLan = JSON.stringify(event.params.header['Accept-Language']);
    let firstName = event['body-json'].firstname;
    let lastName = event['body-json'].lastname;
    let email = event['body-json'].username;    
    let password = event['body-json'].password;
    
    let response = {};
    email = helper.emailToLowerCase(email);

    ({ firstName, lastName } = helper.extractFirstAndLastName(firstName, lastName, email));

    let params = helper.buildParamForSignup(password, email, firstName, lastName, accepLan);

    response = await signupUser(params, response);

    return response;
};

// Signup User
async function signupUser(params, response) {
    await signup.signUp(params).then(function (result) {
        response = result;
    }, function (err) {
        throw new Error("Unable to signin from cognito  " + err);
    });
    return response;
}

