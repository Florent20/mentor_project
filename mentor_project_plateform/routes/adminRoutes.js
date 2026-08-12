const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  monitorRelationships,
  getStats
} = require('../controllers/adminController');

router.get('/users', getAllUsers);
router.get('/relationships', monitorRelationships);
router.get('/stats', getStats);

module.exports = router;