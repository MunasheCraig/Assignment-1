const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const fixturesRoutes = require('./src/routes/fixturesRoutes');
const cacheRoutes = require('./src/routes/cacheRoutes');
require('dotenv').config();

// Import database to trigger initialization
require('./src/config/database');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get('/', (req, res) => {
  res.json({ 
    message: 'Fantasy Premier League Fixtures, API Service',
    version: '1.0.0',
    endpoints: {
      fixtures: '/api/fixtures',
      fixturesByEvent: '/api/fixtures/event/:eventId',
      storeFixtures: '/api/fixtures/store',
      storedFixtures: '/api/fixtures/stored',
      storedFixturesByEvent: '/api/fixtures/stored/event/:eventId',
      cacheStats: '/api/cache/stats',
      clearCache: '/api/cache/clear',
      documentation: '/api-docs'
    }
  });
});

app.use('/api/fixtures', fixturesRoutes);
app.use('/api/cache', cacheRoutes);

app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    message: 'Route not found' 
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});

app.listen(PORT, () => {
  console.log(`FPL Fixtures Service running on http://localhost:${PORT}`);
  console.log(`Swagger Documentation: http://localhost:${PORT}/api-docs`);
});
