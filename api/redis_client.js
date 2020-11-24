const omniClient = require('./ltc_client');
const redis = require('redis');
const client = redis.createClient();

module.exports = {
    redisClient: client,
}
