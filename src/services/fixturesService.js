const axios = require('axios');
const fixturesModel = require('../models/fixturesModel');
const cache = require('../config/cache');

class FixturesService {
  constructor() {
    this.baseURL = 'https://fantasy.premierleague.com/api';
  }

  async fetchFixtures() {
    try {
      const response = await axios.get(`${this.baseURL}/fixtures/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching fixtures from FPL API:', error.message);
      throw new Error('Failed to fetch fixtures from FPL API');
    }
  }

  async getFixturesWithKickoff() {
    try {
      const fixtures = await this.fetchFixtures();
      
      return fixtures.map(fixture => ({
        code: fixture.code,
        kickoff_time: fixture.kickoff_time,
        day: new Date(fixture.kickoff_time).toLocaleDateString('en-GB', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        time: new Date(fixture.kickoff_time).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        home_team: fixture.team_h,
        away_team: fixture.team_a,
        home_team_name: fixture.team_h_name,
        away_team_name: fixture.team_a_name,
        finished: fixture.finished,
        event: fixture.event
      }));
    } catch (error) {
      console.error('Error processing fixtures:', error.message);
      throw error;
    }
  }

  async storeFixturesInDatabase() {
    try {
      console.log('Fetching fixtures from FPL API...');
      
      // Fetch fixtures from FPL API
      const fixtures = await this.getFixturesWithKickoff();
      console.log(`Fetched ${fixtures.length} fixtures from FPL API`);
      
      // Store in database
      console.log('Storing fixtures in database...');
      await fixturesModel.insertFixtures(fixtures);
      
      // Clear cache to force refresh
      await cache.flush();
      console.log('Cache cleared after storing new fixtures');
      
      console.log(`Successfully stored ${fixtures.length} fixtures in database`);
      
      return {
        success: true,
        message: `Successfully stored ${fixtures.length} fixtures in database`,
        count: fixtures.length
      };
    } catch (error) {
      console.error('Error storing fixtures in database:', error.message);
      throw error;
    }
  }

  async getFixturesFromDatabase() {
    try {
      // Check cache first
      const cacheKey = 'fixtures_all';
      const cachedFixtures = await cache.get(cacheKey);
      
      if (cachedFixtures) {
        console.log('Returning cached fixtures data');
        return cachedFixtures;
      }

      console.log('Fetching fixtures from database');
      const fixtures = await fixturesModel.getAllFixtures();
      
      // Cache for 5 minutes
      await cache.set(cacheKey, fixtures, 300);
      console.log('Fixtures cached successfully');
      
      return fixtures;
    } catch (error) {
      console.error('Error fetching fixtures from database:', error.message);
      throw error;
    }
  }

  async getFixturesFromDatabaseByEvent(eventId) {
    try {
      // Check cache first
      const cacheKey = `fixtures_event_${eventId}`;
      const cachedFixtures = await cache.get(cacheKey);
      
      if (cachedFixtures) {
        console.log(`Returning cached fixtures for event ${eventId}`);
        return cachedFixtures;
      }

      console.log(`Fetching fixtures for event ${eventId} from database`);
      const fixtures = await fixturesModel.getFixturesByEvent(eventId);
      
      // Cache for 5 minutes
      await cache.set(cacheKey, fixtures, 300);
      console.log(`Fixtures for event ${eventId} cached successfully`);
      
      return fixtures;
    } catch (error) {
      console.error('Error fetching fixtures from database by event:', error.message);
      throw error;
    }
  }
}

module.exports = new FixturesService();
