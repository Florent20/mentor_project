const { readData, writeData } = require('../utils/fileHelper');
const { isValidId } = require('../utils/validators');

const FILE_NAME = 'mentees.json';

function getAllMentees(req, res) {
  const mentees = readData(FILE_NAME);
  res.status(200).json(mentees);
}

function getMenteeById(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid mentee ID' });
  }

  const mentees = readData(FILE_NAME);
  const mentee = mentees.find(m => m.id === parseInt(req.params.id));

  if (!mentee) {
    return res.status(404).json({ error: 'Mentee not found' });
  }
  res.status(200).json(mentee);
}

function createMentee(req, res) {
  const { name, email, goals } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const mentees = readData(FILE_NAME);

  const newMentee = {
    id: mentees.length > 0 ? mentees[mentees.length - 1].id + 1 : 1,
    name,
    email,
    goals: goals || '',
    createdAt: new Date().toISOString()
  };

  mentees.push(newMentee);
  writeData(FILE_NAME, mentees);

  res.status(201).json(newMentee);
}

function updateMentee(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid mentee ID' });
  }

  const mentees = readData(FILE_NAME);
  const index = mentees.findIndex(m => m.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Mentee not found' });
  }

  const updatedMentee = { ...mentees[index], ...req.body };
  mentees[index] = updatedMentee;
  writeData(FILE_NAME, mentees);

  res.status(200).json(updatedMentee);
}

function deleteMentee(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid mentee ID' });
  }

  const mentees = readData(FILE_NAME);
  const index = mentees.findIndex(m => m.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Mentee not found' });
  }

  mentees.splice(index, 1);
  writeData(FILE_NAME, mentees);

  res.status(200).json({ message: 'Mentee deleted successfully' });
}

module.exports = {
  getAllMentees,
  getMenteeById,
  createMentee,
  updateMentee,
  deleteMentee
};