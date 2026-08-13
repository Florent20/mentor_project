const { readData, writeData } = require('../utils/fileHelper');
const { isValidId } = require('../utils/validators');

const FILE_NAME = 'requests.json';
const MENTORS_FILE = 'mentors.json';
const MENTEES_FILE = 'mentees.json';

function sendRequest(req, res) {
  const { mentorId, menteeId, message } = req.body;

  if (!mentorId || !menteeId) {
    return res.status(400).json({ error: 'mentorId and menteeId are required' });
  }

  const mentors = readData(MENTORS_FILE);
  const mentees = readData(MENTEES_FILE);

  const mentorExists = mentors.some(m => m.id === mentorId);
  const menteeExists = mentees.some(m => m.id === menteeId);

  if (!mentorExists) {
    return res.status(404).json({ error: 'Mentor not found' });
  }
  if (!menteeExists) {
    return res.status(404).json({ error: 'Mentee not found' });
  }

  const requests = readData(FILE_NAME);

  const alreadyPending = requests.some(
    r => r.mentorId === mentorId && r.menteeId === menteeId && r.status === 'pending'
  );
  if (alreadyPending) {
    return res.status(409).json({ error: 'A pending request already exists for this mentor' });
  }

  const newRequest = {
    id: requests.length > 0 ? requests[requests.length - 1].id + 1 : 1,
    mentorId,
    menteeId,
    status: 'pending',
    message: message || '',
    createdAt: new Date().toISOString(),
    respondedAt: null
  };

  requests.push(newRequest);
  writeData(FILE_NAME, requests);

  res.status(201).json(newRequest);
}

function getAllRequests(req, res) {
  const requests = readData(FILE_NAME);
  res.status(200).json(requests);
}

function getRequestsByMentor(req, res) {
  if (!isValidId(req.params.mentorId)) {
    return res.status(400).json({ error: 'Invalid mentor ID' });
  }

  const requests = readData(FILE_NAME);
  const mentorId = parseInt(req.params.mentorId);
  const mentorRequests = requests.filter(r => r.mentorId === mentorId);
  res.status(200).json(mentorRequests);
}

function getRequestsByMentee(req, res) {
  if (!isValidId(req.params.menteeId)) {
    return res.status(400).json({ error: 'Invalid mentee ID' });
  }

  const requests = readData(FILE_NAME);
  const menteeId = parseInt(req.params.menteeId);
  const menteeRequests = requests.filter(r => r.menteeId === menteeId);
  res.status(200).json(menteeRequests);
}

function respondToRequest(req, res) {
  if (!isValidId(req.params.id)) {
    return res.status(400).json({ error: 'Invalid request ID' });
  }

  const { status } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'status must be "accepted" or "rejected"' });
  }

  const requests = readData(FILE_NAME);
  const index = requests.findIndex(r => r.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: 'Request not found' });
  }

  if (requests[index].status !== 'pending') {
    return res.status(409).json({ error: `Request has already been ${requests[index].status}` });
  }

  requests[index].status = status;
  requests[index].respondedAt = new Date().toISOString();

  writeData(FILE_NAME, requests);

  res.status(200).json(requests[index]);
}

function getActiveRelationships(req, res) {
  const requests = readData(FILE_NAME);
  const accepted = requests.filter(r => r.status === 'accepted');
  res.status(200).json(accepted);
}

module.exports = {
  sendRequest,
  getAllRequests,
  getRequestsByMentor,
  getRequestsByMentee,
  respondToRequest,
  getActiveRelationships
};