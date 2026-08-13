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


// Create request
router.post('/', sendRequest);


// Get all requests
router.get('/', getAllRequests);


// Get active relationships
router.get('/active', getActiveRelationships);


// Mentor pending requests
router.get(
    '/mentor/:mentorId/pending',
    getPendingRequestsForMentor
);


// Mentor accepted mentees
router.get(
    '/mentor/:mentorId/mentees',
    getMenteesForMentor
);


// Mentor requests
router.get(
    '/mentor/:mentorId',
    getRequestsByMentor
);


// Mentee requests
router.get(
    '/mentee/:menteeId',
    getRequestsByMentee
);


// Accept / reject
router.put(
    '/:id/respond',
    respondToRequest
);


module.exports = router;