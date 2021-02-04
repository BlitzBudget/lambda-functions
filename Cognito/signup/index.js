const helper = require('helper');
const signup = require('signup');

exports.handler = async (event) => {
    console.log("The event is ", JSON.stringify(event));

    let accepLan = JSON.stringify(event.params.header['Accept-Language']);
    let firstName = event['body-json'].firstname;
    let lastName = event['body-json'].lastname;
    let email = helper.emailToLowerCase(event);
    let response = {};

    ({ firstName, lastName } = helper.extractFirstAndLastName(firstName, lastName, email));

    let params = helper.buildParamForSignup(event, email, firstName, lastName, accepLan);

    await signup.signUp(params).then(function (result) {
        response = result;
    }, function (err) {
        throw new Error("Unable to signin from cognito  " + err);
    });

    return response;
};
