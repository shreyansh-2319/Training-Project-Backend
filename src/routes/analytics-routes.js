const express = require('express');
const router = express.Router();
const {
  getAllAnalytics,
  getStudentAnalytics,
  addAnalytics,
  getLeaderboard
} = require('../controllers/analytics-controller');
const { authMiddleware, roleMiddleware } = require('../middlewares/analytics-middleware');

router.get('/', authMiddleware, getAllAnalytics);
router.get('/student/:id', authMiddleware, getStudentAnalytics);
router.get('/leaderboard', authMiddleware, getLeaderboard);
router.post('/', authMiddleware, roleMiddleware('admin'), addAnalytics);

module.exports = router;
