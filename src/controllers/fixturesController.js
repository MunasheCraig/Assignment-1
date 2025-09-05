const fixturesService = require('../services/fixturesService');

class FixturesController {
  async getFixturesWithKickoff(req, res) {
    try {
      const fixtures = await fixturesService.getFixturesWithKickoff();
      
      res.status(200).json({
        success: true,
        count: fixtures.length,
        data: fixtures
      });
    } catch (error) {
      console.error('Error in getFixturesWithKickoff:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch fixtures',
        error: error.message
      });
    }
  }

  async getFixturesByEvent(req, res) {
    try {
      const { eventId } = req.params;
      const fixtures = await fixturesService.getFixturesWithKickoff();
      
      const filteredFixtures = eventId 
        ? fixtures.filter(fixture => fixture.event === parseInt(eventId))
        : fixtures;
      
      res.status(200).json({
        success: true,
        count: filteredFixtures.length,
        data: filteredFixtures
      });
    } catch (error) {
      console.error('Error in getFixturesByEvent:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch fixtures by event',
        error: error.message
      });
    }
  }

  async storeFixtures(req, res) {
    try {
      const result = await fixturesService.storeFixturesInDatabase();
      
      res.status(200).json({
        success: true,
        message: result.message,
        count: result.count
      });
    } catch (error) {
      console.error('Error in storeFixtures:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to store fixtures in database',
        error: error.message
      });
    }
  }

  async getStoredFixtures(req, res) {
    try {
      const fixtures = await fixturesService.getFixturesFromDatabase();
      
      res.status(200).json({
        success: true,
        count: fixtures.length,
        data: fixtures
      });
    } catch (error) {
      console.error('Error in getStoredFixtures:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stored fixtures',
        error: error.message
      });
    }
  }

  async getStoredFixturesByEvent(req, res) {
    try {
      const { eventId } = req.params;
      const fixtures = await fixturesService.getFixturesFromDatabaseByEvent(eventId);
      
      res.status(200).json({
        success: true,
        count: fixtures.length,
        data: fixtures
      });
    } catch (error) {
      console.error('Error in getStoredFixturesByEvent:', error.message);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch stored fixtures by event',
        error: error.message
      });
    }
  }
}

module.exports = new FixturesController();
