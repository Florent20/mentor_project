const { readData } = require('../utils/fileHelper');

const MENTORS_FILE = 'mentors.json';
const MENTEES_FILE = 'mentees.json';
const REQUESTS_FILE = 'requests.json';
const SESSIONS_FILE = 'sessions.json';

// GET all users (mentors + mentees combined, tagged by role)
function getAllUsers(req, res) {
  const mentors = readData(MENTORS_FILE).map(m => ({ ...m, role: 'mentor' }));
  const mentees = readData(MENTEES_FILE).map(m => ({ ...m, role: 'mentee' }));

  res.status(200).json({
    totalUsers: mentors.length + mentees.length,
    mentors,
    mentees
  });
}

// GET overview of all mentorship relationships with status breakdown
function monitorRelationships(req, res) {
  const requests = readData(REQUESTS_FILE);

  const summary = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    rejected: requests.filter(r => r.status === 'rejected').length
  };

  res.status(200).json({ summary, requests });
}

// GET overall platform stats (nice for a dashboard / presentation demo)
function getStats(req, res) {
  const mentors = readData(MENTORS_FILE);
  const mentees = readData(MENTEES_FILE);
  const requests = readData(REQUESTS_FILE);
  const sessions = readData(SESSIONS_FILE);

  res.status(200).json({
    totalMentors: mentors.length,
    totalMentees: mentees.length,
    totalRequests: requests.length,
    activeRelationships: requests.filter(r => r.status === 'accepted').length,
    totalSessions: sessions.length,
    completedSessions: sessions.filter(s => s.status === 'completed').length,
    upcomingSessions: sessions.filter(s => s.status === 'upcoming').length
  });
}

module.exports = {
  getAllUsers,
  monitorRelationships,
  getStats
};