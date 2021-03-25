function ChangePassword() {}

ChangePassword.prototype.createParameter = (
  accessToken,
  previousPassword,
  newPassword,
) => ({
  AccessToken: accessToken,
  PreviousPassword: previousPassword,
  ProposedPassword: newPassword,
});

// Export object
module.exports = new ChangePassword();
