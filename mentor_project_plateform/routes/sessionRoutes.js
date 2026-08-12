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

router.post('/', createSession);
router.get('/', getAllSessions);
router.get('/upcoming', getUpcomingSessions);
router.get('/:id', getSessionById);
router.put('/:id/feedback', addFeedback);
router.put('/:id/cancel', cancelSession);

module.exports = router;