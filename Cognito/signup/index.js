const helper = require('./helper');
const signup = require('./signup');

// Signup User
async function signupUser(params, response) {
  let signupResponse = response;
  await signup.signUp(params).then(
    (result) => {
      signupResponse = result;
    },
    (err) => {
      throw new Error(`Unable to signin from cognito  ${err}`);
    },
  );
  return signupResponse;
}

exports.handler = async (event) => {
  console.log('The event is ', JSON.stringify(event));

  const accepLan = JSON.stringify(event.params.header['Accept-Language']);
  let firstName = event['body-json'].firstname;
  let lastName = event['body-json'].lastname;
  let email = event['body-json'].username;
  const { password } = event['body-json'];

  let response = {};
  email = helper.emailToLowerCase(email);

  ({ firstName, lastName } = helper.extractFirstAndLastName(
    firstName,
    lastName,
    email,
  ));

  const params = helper.buildParamForSignup(
    password,
    email,
    firstName,
    lastName,
    accepLan,
  );

  response = await signupUser(params, response);

  return response;
};
