const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'fpl_fixtures',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'm12ff01e',
  max: 30, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  acquireTimeoutMillis: 60000,
  createTimeoutMillis: 30000,
  destroyTimeoutMillis: 5000,
  reapIntervalMillis: 1000,
  createRetryIntervalMillis: 200,
});

// Auto-create tables on when server starts
async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    // query to create fixtures table
    const createTableQuery = `
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
    
    await pool.query(createTableQuery);
    console.log('Fixtures table created successfully');
    
    const createIndexesQuery = `
      CREATE INDEX IF NOT EXISTS idx_fixtures_event ON fixtures(event);
      CREATE INDEX IF NOT EXISTS idx_fixtures_kickoff_time ON fixtures(kickoff_time);
      CREATE INDEX IF NOT EXISTS idx_fixtures_code ON fixtures(code);
    `;
    
    await pool.query(createIndexesQuery);
    console.log('Database indexes created successfully');
    console.log('Database initialization completed!');
    
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// Initialize database immediately
initializeDatabase().catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(-1);
});

module.exports = pool;
