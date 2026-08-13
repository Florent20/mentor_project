const express = require('express');

const router = express.Router();

const {
    createSession,
    getAllSessions,
    getUpcomingSessions,
    getSessionById,
    addFeedback,
    cancelSession
} = require('../controllers/sessionController');


// Create session
router.post('/', createSession);


// Get all sessions
router.get('/', getAllSessions);


// Get upcoming sessions
router.get('/upcoming', getUpcomingSessions);


// Get session
router.get('/:id', getSessionById);


// Submit feedback
router.put('/:id/feedback', addFeedback);


// Cancel session
router.put('/:id/cancel', cancelSession);


module.exports = router;