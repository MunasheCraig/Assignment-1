const pool = require('../config/database');

class FixturesModel {
  async createTable() {
    const query = `
      CREATE TABLE IF NOT EXISTS fixtures (
        id SERIAL PRIMARY KEY,
        code INTEGER UNIQUE NOT NULL,
        kickoff_time TIMESTAMP NOT NULL,
        day VARCHAR(100) NOT NULL,
        time VARCHAR(10) NOT NULL,
        home_team INTEGER NOT NULL,
        away_team INTEGER NOT NULL,
        home_team_name VARCHAR(100) NOT NULL,
        away_team_name VARCHAR(100) NOT NULL,
        finished BOOLEAN DEFAULT FALSE,
        event INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await pool.query(query);
      console.log('Fixtures table created successfully');
    } catch (error) {
      console.error('Error creating fixtures table:', error);
      throw error;
    }
  }

  async insertFixture(fixture) {
    const query = `
      INSERT INTO fixtures (
        code, kickoff_time, day, time, home_team, away_team, 
        home_team_name, away_team_name, finished, event
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      ON CONFLICT (code) 
      DO UPDATE SET
        kickoff_time = EXCLUDED.kickoff_time,
        day = EXCLUDED.day,
        time = EXCLUDED.time,
        home_team = EXCLUDED.home_team,
        away_team = EXCLUDED.away_team,
        home_team_name = EXCLUDED.home_team_name,
        away_team_name = EXCLUDED.away_team_name,
        finished = EXCLUDED.finished,
        event = EXCLUDED.event,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const values = [
      fixture.code,
      fixture.kickoff_time,
      fixture.day,
      fixture.time,
      fixture.home_team,
      fixture.away_team,
      fixture.home_team_name,
      fixture.away_team_name,
      fixture.finished,
      fixture.event
    ];

    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Error inserting fixture:', error);
      throw error;
    }
  }

  async insertFixtures(fixtures) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      for (const fixture of fixtures) {
        await this.insertFixture(fixture);
      }
      
      await client.query('COMMIT');
      console.log(`Successfully stored ${fixtures.length} fixtures in database`);
    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Error inserting fixtures:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getAllFixtures() {
    const query = `
      SELECT * FROM fixtures 
      ORDER BY kickoff_time ASC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error fetching fixtures:', error);
      throw error;
    }
  }

  async getFixturesByEvent(eventId) {
    const query = `
      SELECT * FROM fixtures 
      WHERE event = $1 
      ORDER BY kickoff_time ASC
    `;
    
    try {
      const result = await pool.query(query, [eventId]);
      return result.rows;
    } catch (error) {
      console.error('Error fetching fixtures by event:', error);
      throw error;
    }
  }

  async getFixtureByCode(code) {
    const query = `
      SELECT * FROM fixtures 
      WHERE code = $1
    `;
    
    try {
      const result = await pool.query(query, [code]);
      return result.rows[0];
    } catch (error) {
      console.error('Error fetching fixture by code:', error);
      throw error;
    }
  }

  async deleteAllFixtures() {
    const query = 'DELETE FROM fixtures';
    
    try {
      const result = await pool.query(query);
      console.log(`Deleted ${result.rowCount} fixtures`);
      return result.rowCount;
    } catch (error) {
      console.error('Error deleting fixtures:', error);
      throw error;
    }
  }
}

module.exports = new FixturesModel();
