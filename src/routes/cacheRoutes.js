const express = require('express');
const cache = require('../config/cache');

const router = express.Router();

// GET /api/cache/stats - Get cache statistics
router.get('/stats', (req, res) => {
  try {
    const stats = cache.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get cache stats',
      error: error.message
    });
  }
});

// DELETE /api/cache/clear - Clear all cache
router.delete('/clear', async (req, res) => {
  try {
    await cache.flush();
    res.json({
      success: true,
      message: 'Cache cleared successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to clear cache',
      error: error.message
    });
  }
});

module.exports = router;
