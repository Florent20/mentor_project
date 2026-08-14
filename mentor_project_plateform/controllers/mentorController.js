const { readData, writeData } = require('../utils/fileHelper');
const { isValidId } = require('../utils/validators');

const FILE_NAME = 'mentors.json';

function stripPassword(mentor) {
  const { password, ...safe } = mentor;
  return safe;
}

function getAllMentors(req, res) {
  const mentors = readData(FILE_NAME);
  res.status(200).json(mentors.map(stripPassword));
}

function getMentorById(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid mentor ID' });
  }
  const mentors = readData(FILE_NAME);
  const mentor = mentors.find(m => m.id === parseInt(req.params.id));

  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found' });
  }
  res.status(200).json(stripPassword(mentor));
}

function createMentor(req, res) {
  const { name, email, password, bio, skills } = req.body;
  const normalizedSkills = Array.isArray(skills) ? skills.map(skill => String(skill).trim()).filter(Boolean) : [];

  if (!name || !email || !password || normalizedSkills.length === 0) {
    return res.status(400).json({ error: 'Name, email, password, and at least one skill are required' });
  }

  const mentors = readData(FILE_NAME);

  const emailTaken = mentors.some(m => m.email === email);
  if (emailTaken) {
    return res.status(409).json({ error: 'Email is already registered' });
  }

  const newMentor = {
    id: mentors.length > 0 ? mentors[mentors.length - 1].id + 1 : 1,
    name,
    email,
    password,
    bio: bio || '',
    skills: normalizedSkills,
    createdAt: new Date().toISOString()
  };

  mentors.push(newMentor);
  writeData(FILE_NAME, mentors);

  res.status(201).json(stripPassword(newMentor));
}

function updateMentor(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid mentor ID' });
  }
  const mentors = readData(FILE_NAME);
  const index = mentors.findIndex(m => m.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Mentor not found' });
  }

  const updatedMentor = { ...mentors[index], ...req.body };
  mentors[index] = updatedMentor;
  writeData(FILE_NAME, mentors);

  res.status(200).json(stripPassword(updatedMentor));
}

function deleteMentor(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid mentor ID' });
  }
  const mentors = readData(FILE_NAME);
  const index = mentors.findIndex(m => m.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Mentor not found' });
  }

  mentors.splice(index, 1);
  writeData(FILE_NAME, mentors);

  res.status(200).json({ message: 'Mentor deleted successfully' });
}

module.exports = {
  getAllMentors,
  getMentorById,
  createMentor,
  updateMentor,
  deleteMentor
};