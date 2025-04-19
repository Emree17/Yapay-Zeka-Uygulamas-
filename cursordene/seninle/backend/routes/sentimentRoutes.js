const express = require('express');
const { 
  analyzeSentiment, 
  getEmotionTrends 
} = require('../controllers/sentimentController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @route POST /api/sentiment/analyze
 * @desc Metin tabanlı duygu analizi yapar
 * @access Private
 */
router.post('/analyze', authenticateJWT, analyzeSentiment);

/**
 * @route GET /api/sentiment/trends
 * @desc Kullanıcının duygusal trendlerini getirir
 * @access Private
 */
router.get('/trends', authenticateJWT, getEmotionTrends);

module.exports = router; 