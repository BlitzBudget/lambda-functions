function Helper() {}

function formulateDateFromRequest(event) {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  return today;
}

Helper.prototype.formulateDateFromRequest = formulateDateFromRequest;

// Export object
module.exports = new Helper();
