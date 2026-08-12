const fs = require('fs');
const path = require('path');

function readData(fileName) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  try {
    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (err) {
    console.error(`Error reading ${fileName}:`, err.message);
    return [];
  }
}

function writeData(fileName, data) {
  const filePath = path.join(__dirname, '..', 'data', fileName);
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(`Error writing ${fileName}:`, err.message);
    throw err; // let the controller know the write failed
  }
}

module.exports = { readData, writeData };