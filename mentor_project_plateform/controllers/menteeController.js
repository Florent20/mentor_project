const { readData, writeData } = require('../utils/fileHelper');
const { isValidId } = require('../utils/validators');

const FILE_NAME = 'mentees.json';

function stripPassword(mentee) {
  const { password, ...safe } = mentee;
  return safe;
}

function getAllMentees(req, res) {
  const mentees = readData(FILE_NAME);
  res.status(200).json(mentees.map(stripPassword));
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
  res.status(200).json(stripPassword(mentee));
}

function createMentee(req, res) {
  const { name, email, password, goals } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const mentees = readData(FILE_NAME);

  const emailTaken = mentees.some(m => m.email === email);
  if (emailTaken) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  const newMentee = {
    id: mentees.length > 0 ? mentees[mentees.length - 1].id + 1 : 1,
    name,
    email,
    password,
    goals: goals || '',
    progress: 0,
    createdAt: new Date().toISOString()
  };

  mentees.push(newMentee);
  writeData(FILE_NAME, mentees);

  res.status(201).json(stripPassword(newMentee));
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

  res.status(200).json(stripPassword(updatedMentee));
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