const { readData } = require('../utils/fileHelper');

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const mentors = readData('mentors.json');
  const mentors_match = mentors.find(m => m.email === email && m.password === password);
  if (mentors_match) {
    const { password: _, ...safeMentor } = mentors_match;
    return res.status(200).json({ ...safeMentor, role: 'mentor' });
  }

  const mentees = readData('mentees.json');
  const mentee_match = mentees.find(m => m.email === email && m.password === password);
  if (mentee_match) {
    const { password: _, ...safeMentee } = mentee_match;
    return res.status(200).json({ ...safeMentee, role: 'mentee' });
  }

  res.status(401).json({ error: 'Invalid email or password' });
}

module.exports = { login };