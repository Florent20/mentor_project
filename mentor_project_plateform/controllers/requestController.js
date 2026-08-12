const { readData, writeData } = require('../utils/fileHelper');

const FILE_NAME = 'requests.json';
const MENTORS_FILE = 'mentors.json';
const MENTEES_FILE = 'mentees.json';

// POST - mentee sends a request to a mentor
function sendRequest(req, res) {
  const { mentorId, menteeId, message } = req.body;

  if (!mentorId || !menteeId) {
    return res.status(400).json({ error: 'mentorId and menteeId are required' });
  }

  // Validate mentor and mentee actually exist
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

  // Prevent duplicate pending requests to the same mentor
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

// GET all requests (admin/general view)
function getAllRequests(req, res) {
  const requests = readData(FILE_NAME);
  res.status(200).json(requests);
}

// GET requests for a specific mentor
function getRequestsByMentor(req, res) {
  const requests = readData(FILE_NAME);
  const mentorId = parseInt(req.params.mentorId);
  const mentorRequests = requests.filter(r => r.mentorId === mentorId);
  res.status(200).json(mentorRequests);
}

// GET requests for a specific mentee
function getRequestsByMentee(req, res) {
  const requests = readData(FILE_NAME);
  const menteeId = parseInt(req.params.menteeId);
  const menteeRequests = requests.filter(r => r.menteeId === menteeId);
  res.status(200).json(menteeRequests);
}

// PUT - mentor accepts or rejects a request
function respondToRequest(req, res) {
  const { status } = req.body; // expected: "accepted" or "rejected"

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

// GET active mentorship relationships (accepted requests)
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