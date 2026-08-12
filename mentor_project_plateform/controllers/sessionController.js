const { readData, writeData } = require('../utils/fileHelper');

const FILE_NAME = 'sessions.json';
const REQUESTS_FILE = 'requests.json';

// POST - create a new session (only for accepted requests)
function createSession(req, res) {
  const { requestId, scheduledDate, topic } = req.body;

  if (!requestId || !scheduledDate || !topic) {
    return res.status(400).json({ error: 'requestId, scheduledDate, and topic are required' });
  }

  const requests = readData(REQUESTS_FILE);
  const request = requests.find(r => r.id === requestId);

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (request.status !== 'accepted') {
    return res.status(409).json({ error: 'Sessions can only be created for accepted requests' });
  }

  const sessions = readData(FILE_NAME);

  const newSession = {
    id: sessions.length > 0 ? sessions[sessions.length - 1].id + 1 : 1,
    requestId,
    mentorId: request.mentorId,
    menteeId: request.menteeId,
    scheduledDate,
    topic,
    status: 'upcoming',
    feedback: null,
    createdAt: new Date().toISOString()
  };

  sessions.push(newSession);
  writeData(FILE_NAME, sessions);

  res.status(201).json(newSession);
}

// GET all sessions
function getAllSessions(req, res) {
  const sessions = readData(FILE_NAME);
  res.status(200).json(sessions);
}

// GET upcoming sessions (optionally filter by mentor or mentee)
function getUpcomingSessions(req, res) {
  const sessions = readData(FILE_NAME);
  const { mentorId, menteeId } = req.query;

  let upcoming = sessions.filter(s => s.status === 'upcoming');

  if (mentorId) {
    upcoming = upcoming.filter(s => s.mentorId === parseInt(mentorId));
  }
  if (menteeId) {
    upcoming = upcoming.filter(s => s.menteeId === parseInt(menteeId));
  }

  res.status(200).json(upcoming);
}

// GET single session by ID
function getSessionById(req, res) {
  const sessions = readData(FILE_NAME);
  const session = sessions.find(s => s.id === parseInt(req.params.id));

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }
  res.status(200).json(session);
}

// PUT - add feedback to a session (and mark completed)
function addFeedback(req, res) {
  const { fromMentor, fromMentee } = req.body;

  const sessions = readData(FILE_NAME);
  const index = sessions.findIndex(s => s.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Session not found' });
  }

  sessions[index].feedback = {
    fromMentor: fromMentor || sessions[index].feedback?.fromMentor || null,
    fromMentee: fromMentee || sessions[index].feedback?.fromMentee || null
  };
  sessions[index].status = 'completed';

  writeData(FILE_NAME, sessions);

  res.status(200).json(sessions[index]);
}

// PUT - cancel a session
function cancelSession(req, res) {
  const sessions = readData(FILE_NAME);
  const index = sessions.findIndex(s => s.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Session not found' });
  }

  sessions[index].status = 'cancelled';
  writeData(FILE_NAME, sessions);

  res.status(200).json(sessions[index]);
}

module.exports = {
  createSession,
  getAllSessions,
  getUpcomingSessions,
  getSessionById,
  addFeedback,
  cancelSession
};