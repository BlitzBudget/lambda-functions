const sesParameter = require('./create-parameter/ses');
const ses = require('./ses/send');

exports.handler = async (event) => {
  console.log(
    'The from email address is ',
    event['body-json'].email,
    ' The subject is ',
    event['body-json'].subject,
  );
  const params = sesParameter.createParameter(event);

  await ses.sendEmail(params);
};
