const omniClient = require('../ltc_client');
const { redisClient } = require('../redis_client');
// const { blockchainInfo } = require('../scripts/blockchainInfo');


const findNewBlocks = () => {

    // const blockchainInfoArr = [];

    // first check if blockchainInfo exist on redis
    const blockchainInfoRedisKey = 'blockChainInfo';
    const blocksInfoRedisKey = 'blocksInfo';
    redisClient.get(blockchainInfoRedisKey, (err, blockchainInfo) => {

        redisClient.get(blocksInfoRedisKey, (err, blocksInfo) => {

            if(blockchainInfo && blocksInfo) {
                const blocksInfoArr = JSON.parse(blocksInfo);
                console.log(blockchainInfo)
                const { bestblockhash, blocks } = JSON.parse(blockchainInfo);
                const oldBestblockhash = bestblockhash;
                const oldBlocks = blocks;
                omniClient.cmd('getblockchaininfo', (err, response) => {
    
                    if(response) {
                        console.log('response', response)
                        const { bestblockhash, blocks } = response;
                        const newBestblockhash = bestblockhash;
                        const newBlocks = blocks;
                        const blocksDiff = (newBlocks - oldBlocks);
                        const blockHashArr = [];
    
                        // get block hash using the loop
                        for(i = 0; i < blocksDiff; i++) {
    
                            omniClient.cmd('getblockhash', (oldBlocks + i), (err, blockHash) => {
    
                                if(blockHash) {
                                    console.log('blockHash', blockHash)
                                    omniClient.cmd('getblock', blockHash, (err, blocksObj) => {
                                        
                                        if(blocksObj) {
                                            console.log('blocksObj', blocksObj)
                                            const blocksInfoObj = {
                                                height: blocksObj.height,
                                                timestamp: blocksObj.time,
                                                transactions: blocksObj.tx.length,
                                                value: '',
                                                hash: blocksObj.hash,
                                            }
                                            // blocksInfoArr.concat(blocksObj);
                                            redisClient.setex(blocksInfoRedisKey, 3600, JSON.stringify(blocksInfoArr.concat(blocksInfoObj)));
                                        }
                                    })
                                }
                            })
                        }
                    }
                })
                
                console.log('blocksInfoArr', blocksInfoArr);
                // return blockchainInfoArr;
            }
        })
    })
}

module.exports = {
    findNewBlocks,
}