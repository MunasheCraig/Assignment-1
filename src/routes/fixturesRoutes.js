const express = require('express');
const fixturesController = require('../controllers/fixturesController');

const router = express.Router();

// GET /api/fixtures - Get all fixtures with kickoff times (from FPL API)
router.get('/', fixturesController.getFixturesWithKickoff);

// GET /api/fixtures/event/:eventId - Get fixtures by specific event (gameweek) from FPL API
router.get('/event/:eventId', fixturesController.getFixturesByEvent);

// POST /api/fixtures/store - Store fixtures in database
router.post('/store', fixturesController.storeFixtures);

// GET /api/fixtures/stored - Get all stored fixtures from database
router.get('/stored', fixturesController.getStoredFixtures);

// GET /api/fixtures/stored/event/:eventId - Get stored fixtures by event from database
router.get('/stored/event/:eventId', fixturesController.getStoredFixturesByEvent);

module.exports = router;
