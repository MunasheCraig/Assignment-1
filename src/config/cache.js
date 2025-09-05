const NodeCache = require('node-cache');

// Creating cache instance with 5 minute TTL
const cache = new NodeCache({ 
  stdTTL: 300, 
  checkperiod: 60, 
  useClones: false 
});

const cacheHelper = {
  async get(key) {
    return cache.get(key);
  },

  async set(key, value, ttl = 300) {
    return cache.set(key, value, ttl);
  },

  async del(key) {
    return cache.del(key);
  },

  async flush() {
    return cache.flushAll();
  },

  getStats() {
    return cache.getStats();
  }
};

module.exports = cacheHelper;
