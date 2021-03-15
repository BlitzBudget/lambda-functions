module.exports = (parameters) => ({
  UserConfirmed: false,
  CodeDeliveryDetails: {
    Destination: parameters.Username,
    DeliveryMedium: 'EMAIL',
    AttributeName: 'email',
  },
  UserSub: 'c5f9af98-ebcb-4c9c-8be4-9c1bc6bfbcad',
});
