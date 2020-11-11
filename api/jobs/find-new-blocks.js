const omniClient = require('../ltc_client');
const { redisClient } = require('../redis_client');
// const { blockchainInfo } = require('../scripts/blockchainInfo');


const findNewBlocks = () => {

    const getInfoArr = [];

    // first check if getInfo exist on redis
    const getInfoRedisKey = 'getInfo';
    const blocksInfoRedisKey = 'blocksInfo';
    redisClient.get(getInfoRedisKey, (err, getInfo) => {

        redisClient.get(blocksInfoRedisKey, (err, blocksInfo) => {

            if(getInfo && blocksInfo) {
                const blocksInfoArr = JSON.parse(blocksInfo);
                console.log(getInfo)
                const { block } = JSON.parse(getInfo);
                const oldBlocks = block;
                omniClient.cmd('tl_getinfo', (err, response) => {
    
                    if(response) {
                        console.log('response', response)
                        const { block } = response;
                        const newBlocks = block;
                        const blocksDiff = (newBlocks - oldBlocks);
    
                        // get block hash using the loop
                        for(i = 0; i < blocksDiff; i++) {
    
                            omniClient.cmd('getblockhash', (oldBlocks + i), (err, getBlockHash) => {
    
                                if(getBlockHash) {

                                    omniClient.cmd('getblock', getBlockHash, (err, blocksObj) => {
                                        
                                        if(blocksObj) {
                                            console.log('blocksObj', blocksObj)
                                            const blocksInfoObj = {
                                                height: blocksObj.height,
                                                timestamp: blocksObj.time,
                                                transactions: blocksObj.tx.length,
                                                value: '',
                                                hash: blocksObj.hash,
                                            }

                                            redisClient.setex(blocksInfoRedisKey, 3600, JSON.stringify(blocksInfoArr.concat(blocksInfoObj)));
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
                
                console.log('blocksInfoArr', blocksInfoArr);
            }
        })
    })
}

module.exports = {
    findNewBlocks,
}