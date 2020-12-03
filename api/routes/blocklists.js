const express = require('express');
const blocklistRouter = express.Router();
const { redisClient } = require('../redis_client');
const { getInfo } = require('../scripts/getInfo');
const { findNewBlockTask } = require('../jobs');
const omniClient = require('../ltc_client');

blocklistRouter.get('/', (req, res) => {

    // first check if blocks info redis key exist
    const blocksInfoRedisKey = 'blocksInfo';
    redisClient.get(blocksInfoRedisKey, (err, blocklist) => {

        if(blocklist) {
            console.log('blocklist: ', blocklist)
            res.json({
                blocks: JSON.parse(blocklist),
            })
        }
        getInfo(omniClient);
        findNewBlockTask.start();

        setTimeout(() => {
            redisClient.get(blocksInfoRedisKey, (err, blocklist) => {

                if(blocklist) {
                    console.log('blocklist: ', blocklist)
                    res.json({
                        blocks: JSON.parse(blocklist),
                    })
                }
            })
        }, 1000)
    })

})

module.exports = blocklistRouter;
