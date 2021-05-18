function Helper() {}

function formulateDateFromRequest(event) {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(5, 9));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(10, 12), 10) - 1,
  );
  return today;
}

function formateDateWithoutID(event) {
  const today = new Date();
  today.setYear(event['body-json'].dateMeantFor.substring(0, 4));
  today.setMonth(
    parseInt(event['body-json'].dateMeantFor.substring(5, 7), 10) - 1,
  );
  return today;
}

Helper.prototype.formulateDateFromRequest = formulateDateFromRequest;
Helper.prototype.formateDateWithoutID = formateDateWithoutID;

// Export object
module.exports = new Helper();
