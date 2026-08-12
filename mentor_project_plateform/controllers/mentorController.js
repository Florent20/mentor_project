const { readData, writeData } = require('../utils/fileHelper');

const FILE_NAME = 'mentors.json';

// GET all mentors
function getAllMentors(req, res) {
  const mentors = readData(FILE_NAME);
  res.status(200).json(mentors);
}

// GET single mentor by ID
function getMentorById(req, res) {
  const mentors = readData(FILE_NAME);
  const mentor = mentors.find(m => m.id === parseInt(req.params.id));

  if (!mentor) {
    return res.status(404).json({ error: 'Mentor not found' });
  }
  res.status(200).json(mentor);
}

// POST create new mentor
function createMentor(req, res) {
  const { name, email, bio, skills } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const mentors = readData(FILE_NAME);

  const newMentor = {
    id: mentors.length > 0 ? mentors[mentors.length - 1].id + 1 : 1,
    name,
    email,
    bio: bio || '',
    skills: skills || [],
    createdAt: new Date().toISOString()
  };

  mentors.push(newMentor);
  writeData(FILE_NAME, mentors);

  res.status(201).json(newMentor);
}

// PUT update mentor
function updateMentor(req, res) {
  const mentors = readData(FILE_NAME);
  const index = mentors.findIndex(m => m.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Mentor not found' });
  }

  const updatedMentor = { ...mentors[index], ...req.body };
  mentors[index] = updatedMentor;
  writeData(FILE_NAME, mentors);

  res.status(200).json(updatedMentor);
}

// DELETE mentor
function deleteMentor(req, res) {
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