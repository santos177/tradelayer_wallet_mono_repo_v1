const express = require('express');
const blocklistRouter = express.Router();
const { redisClient } = require('../redis_client');

blocklistRouter.get('/', (req, res) => {

    // first check if blocks info redis key exist
    const blocksInfoRedisKey = 'blocksInfo';
    redisClient.get(blocksInfoRedisKey, (err, blocklist) => {

        if(blocklist) {
            console.log('blocklist: ', blocklist)
            res.json({
                data: {
                    blocklist: JSON.parse(blocklist)
                },
                isBlocklist: true,
            })
        }
    })

})

module.exports = blocklistRouter;