const express = require('express');
const router = express.Router();
const {
  getAllMentees,
  getMenteeById,
  createMentee,
  updateMentee,
  deleteMentee
} = require('../controllers/menteeController');

router.get('/', getAllMentees);
router.get('/:id', getMenteeById);
router.post('/', createMentee);
router.put('/:id', updateMentee);
router.delete('/:id', deleteMentee);

module.exports = router;