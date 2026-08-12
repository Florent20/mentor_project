function isValidId(id) {
  const parsed = parseInt(id);
  return !isNaN(parsed) && parsed > 0;
}

module.exports = { isValidId };