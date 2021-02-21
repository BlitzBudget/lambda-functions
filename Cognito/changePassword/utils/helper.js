function Helper() {}

Helper.prototype.changePasswordParameters = (
  accessToken,
  previousPassword,
  newPassword,
) => ({
  AccessToken: accessToken,
  PreviousPassword: previousPassword,
  ProposedPassword: newPassword,
});

// Export object
module.exports = new Helper();
