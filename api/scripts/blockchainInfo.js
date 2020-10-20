const { redisClient } = require('../redis_client');

const blockchainInfo = (blockchainParams) => {
    const { omniClient } = blockchainParams;
    const blockchainInfoRedisKey = 'blockChainInfo';
    const blocksInfoRedisKey = 'blocksInfo';
    const blockTxnRedisKey = 'blockTxnRedisKey';

    redisClient.on('error', (err) => {
        console.log('Error', err);
    })

    redisClient.del(blockTxnRedisKey);

    // first check if blockchainInfo and blocksInfo exist on redis
    redisClient.get(blockchainInfoRedisKey, (err, blockchainInfo) => {

        redisClient.get(blocksInfoRedisKey, (err, blocksInfo) => {

            if(blockchainInfo && blocksInfo) {
                console.log('getBlockchainInfo XXX', JSON.parse(blockchainInfo))
                console.log('getBlocksInfo', JSON.parse(blocksInfo));
                redisClient.setex(blockTxnRedisKey, 3600, JSON.stringify([]));

                return {
                    source: 'cache',
                    data: {
                        blockchainInfo: JSON.parse(blockchainInfo),
                        blocksInfo: JSON.parse(blocksInfo)
                    }
                }
            }
    
            omniClient.cmd('getblockchaininfo', (err, response) => {

                console.log('RESPONSE: ', response);
    
                if(response) {
                    redisClient.setex(blockchainInfoRedisKey, 3600, JSON.stringify(response));
                    redisClient.setex(blocksInfoRedisKey, 3600, JSON.stringify([]));
                    // redisClient.setex(blockTxnRedisKey, 3600, JSON.stringify([]));
                    console.log('blockchainInfo X', JSON.parse(blockchainInfo))
                    console.log('blocksInfo X', JSON.parse(blocksInfo))
                    return {
                        source: 'cache',
                        data: {
                            blockchainInfo: JSON.parse(blockchainInfo),
                            blocksInfo: JSON.parse(blocksInfo)
                        }
                    }
                }
            })
        })
    })
}

module.exports = {
    blockchainInfo
}