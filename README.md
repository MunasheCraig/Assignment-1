# FPL Fixtures API

A comprehensive backend API service for tracking Fantasy Premier League (FPL) game records and fixtures, built with Express.js and PostgreSQL.

## Features

- **FPL API Integration** - Fetches live fixture data from the official Fantasy Premier League API
- **PostgreSQL Database** - Stores fixture records with automatic table creation
- **Response Caching** - In-memory caching for improved API performance
- **RESTful API** - Clean, well-documented endpoints
- **Swagger Documentation** - Interactive API documentation
- **Performance Optimized** - Database connection pooling and caching strategies

## API Endpoints

### Fixtures
- `GET /api/fixtures` - Get all fixtures with kickoff times from FPL API
- `GET /api/fixtures/event/:eventId` - Get fixtures by specific gameweek from FPL API
- `POST /api/fixtures/store` - Store fixtures in PostgreSQL database
- `GET /api/fixtures/stored` - Get all stored fixtures from database
- `GET /api/fixtures/stored/event/:eventId` - Get stored fixtures by gameweek

### Cache Management
- `GET /api/cache/stats` - View cache statistics
- `DELETE /api/cache/clear` - Clear all cached data

### Documentation
- `GET /api-docs` - Interactive Swagger documentation

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Caching**: node-cache
- **Documentation**: Swagger UI
- **HTTP Client**: Axios

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MunasheCraig/Assignment-1.git
   cd Assignment-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=fpl_fixtures
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   
   # Server Configuration
   PORT=5000
   ```

4. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE fpl_fixtures;
   ```

5. **Start the server**
   ```bash
   npm start
   ```

The server will automatically create the required database tables on startup.

## Quick Start

1. **Start the server**
   ```bash
   npm start
   ```

2. **Store fixtures in database**
   ```bash
   curl -X POST http://localhost:5000/api/fixtures/store
   ```

3. **View API documentation**
   Open `http://localhost:5000/api-docs` in your browser

4. **Test endpoints**
   ```bash
   # Get all fixtures from FPL API
   curl http://localhost:5000/api/fixtures
   
   # Get stored fixtures from database
   curl http://localhost:5000/api/fixtures/stored
   
   # Get fixtures by gameweek
   curl http://localhost:5000/api/fixtures/stored/event/21
   ```

## Database Schema

### Fixtures Table
```sql
CREATE TABLE fixtures (
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
```

## Performance Features

- **Response Caching** - 5-minute TTL for cached API responses
- **Database Connection Pooling** - Optimized connection management
- **Automatic Indexing** - Database indexes for faster queries
- **Smart Cache Invalidation** - Cache clears when data is updated

## Project Structure

```
├── src/
│   ├── config/
│   │   ├── database.js      # PostgreSQL connection and initialization
│   │   └── cache.js         # Caching configuration
│   ├── controllers/
│   │   └── fixturesController.js  # Request handlers
│   ├── models/
│   │   └── fixturesModel.js       # Database operations
│   ├── routes/
│   │   ├── fixturesRoutes.js      # Fixture endpoints
│   │   └── cacheRoutes.js         # Cache management endpoints
│   └── services/
│       └── fixturesService.js     # Business logic and FPL API integration
├── server.js               # Main server file
├── swagger.json           # API documentation
└── package.json           # Dependencies and scripts
```

## Development

```bash
# Start development server with auto-reload
npm run dev

# View cache statistics
curl http://localhost:5000/api/cache/stats

# Clear cache
curl -X DELETE http://localhost:5000/api/cache/clear
```

## API Response Format

```json
{
  "success": true,
  "count": 380,
  "data": [
    {
      "code": 1,
      "kickoff_time": "2024-01-15T15:00:00Z",
      "day": "Monday, 15 January 2024",
      "time": "15:00",
      "home_team": 1,
      "away_team": 2,
      "home_team_name": "Arsenal",
      "away_team_name": "Chelsea",
      "finished": false,
      "event": 21
    }
  ]
}
```

## Error Handling

The API includes comprehensive error handling with meaningful error messages and proper HTTP status codes.

## License

This project is licensed under the MIT License.

## Author

**Munashe Mhonda**
- GitHub: [@MunasheCraig](https://github.com/MunasheCraig)

---

