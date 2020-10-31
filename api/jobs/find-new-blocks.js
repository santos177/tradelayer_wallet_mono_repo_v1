const omniClient = require('../ltc_client');
const { redisClient } = require('../redis_client');
// const { blockchainInfo } = require('../scripts/blockchainInfo');


const findNewBlocks = () => {

    // const blockchainInfoArr = [];

    // first check if getInfo exist on redis
    const getInfoRedisKey = 'getInfo';
    const blocksInfoRedisKey = 'blocksInfo';
    redisClient.get(getInfoRedisKey, (err, getInfo) => {

        redisClient.get(blocksInfoRedisKey, (err, blocksInfo) => {

            if(getInfo && blocksInfo) {
                const blocksInfoArr = JSON.parse(blocksInfo);
                console.log(getInfo)
                const { blocks } = JSON.parse(getInfo);
                const oldBlocks = blocks;
                omniClient.cmd('getinfo', (err, response) => {
    
                    if(response) {
                        console.log('response', response)
                        const { blocks } = response;
                        const newBlocks = blocks;
                        const blocksDiff = (newBlocks - oldBlocks);
    
                        // get block hash using the loop
                        for(i = 0; i < blocksDiff; i++) {
    
                            omniClient.cmd('tl_listblocktransactions', (oldBlocks + i), (err, blockTransactions) => {
    
                                if(blockTransactions) {
                                    console.log('blockTransaction', blockTransactions)

                                    blockTransactions.map((blockTransaction, index) => {

                                        omniClient.cmd('tl_listtransactions', blockTransaction, (err, blocksObj) => {
                                        
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
                                    })
                                }
                            })
                        }
                    }
                })
                
                console.log('blocksInfoArr', blocksInfoArr);
                // return getInfoArr;
            }
        })
    })
}

module.exports = {
    findNewBlocks,
}