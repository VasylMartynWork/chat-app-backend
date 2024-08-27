const { Redis } = require('ioredis');

const redis = new Redis({
  host: process.env.APP_REDIS_HOST,
  port: +process.env.APP_REDIS_PORT,
});

module.exports = redis;
