const fs = require('fs');
const path = require('path');

// Read data from a JSON file
function readData(fileName) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
}

// Write data to a JSON file
function writeData(fileName, data) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = { readData, writeData };