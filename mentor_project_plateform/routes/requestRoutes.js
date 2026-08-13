const express = require('express');
const router = express.Router();
const {
  sendRequest,
  getAllRequests,
  getRequestsByMentor,
  getRequestsByMentee,
  getPendingRequestsForMentor,
  getMenteesForMentor,
  respondToRequest,
  getActiveRelationships
} = require('../controllers/requestController');

router.post('/', sendRequest);
router.get('/', getAllRequests);
router.get('/active', getActiveRelationships);
router.get('/mentor/:mentorId/pending', getPendingRequestsForMentor);
router.get('/mentor/:mentorId/mentees', getMenteesForMentor);
router.get('/mentor/:mentorId', getRequestsByMentor);
router.get('/mentee/:menteeId', getRequestsByMentee);
router.put('/:id/respond', respondToRequest);

module.exports = router;