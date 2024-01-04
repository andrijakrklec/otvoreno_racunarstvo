function isNumeric(str) {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
}

function isDateFormatValid(dateString) {
  const pattern = /^\d{2}.\d{2}.\d{4}.$/;
  return pattern.test(dateString);
}

module.exports = {isNumeric, isDateFormatValid}