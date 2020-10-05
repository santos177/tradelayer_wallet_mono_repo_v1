const omniClient = require('./ltc_client');
const redis = require('redis');
const client = redis.createClient(6379);

module.exports = {
    redisClient: client,
}