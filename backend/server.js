// backend/server.js
const express = require('express');
const Redis = require('ioredis');
const os = require('os');

const app = express();

// Connect to redis service by service name (docker-compose) or env override
const redisHost = process.env.REDIS_HOST || 'redis';
const redisPort = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
const redis = new Redis({ host: redisHost, port: redisPort });

// Use explicit SERVER_ID env if provided, otherwise fallback to container/host hostname
const SERVER_ID = process.env.SERVER_ID || os.hostname() || 'unknown-server';

app.get('/api/updates', async (req, res) => {
  try {
    // increment a global counter in redis
    const count = await redis.incr('page_hits');
    res.json({
      message: `hello! from ${SERVER_ID}`,
      updates: Number(count)
    });
  } catch (err) {
    console.error('Redis error:', err);
    res.status(500).json({ error: 'internal' });
  }
});

// Simple health check for orchestration / load balancers
app.get('/health', (req, res) => res.send('ok'));

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT} (${SERVER_ID})`);
});
