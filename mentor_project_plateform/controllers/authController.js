const { readData } = require('../utils/fileHelper');

function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const mentors = readData('mentors.json');
  const mentorMatch = mentors.find(m => m.email === email && m.password === password);
  if (mentorMatch) {
    const { password: _, ...safeMentor } = mentorMatch;
    return res.status(200).json({ ...safeMentor, role: 'mentor' });
  }

  const mentees = readData('mentees.json');
  const menteeMatch = mentees.find(m => m.email === email && m.password === password);
  if (menteeMatch) {
    const { password: _, ...safeMentee } = menteeMatch;
    return res.status(200).json({ ...safeMentee, role: 'mentee' });
  }

  res.status(401).json({ error: 'Invalid email or password' });
}

module.exports = { login };