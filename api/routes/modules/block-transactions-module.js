const { redisClient } = require('../../redis_client');
const omniClient = require('../../ltc_client');

const blockTransactionsModule = async (hash) => {

    const blockTxnRedisKey = 'blockTxnRedisKey';

    redisClient.get(blockTxnRedisKey, (err, blockTransaction) => {
        if((JSON.parse(blockTransaction).length < 1) && (JSON.parse(blockTransaction).length > -1)) {
            
            let blockTransactionArr = JSON.parse(blockTransaction);
            console.log('blockTransactionArr: ', blockTransactionArr)
            
            omniClient.cmd('getblock', hash, (err, block) => {

                if(block) {
                    const { tx } = block;
                    console.log('tx: ', tx)
                    tx.map((transaction, index) => {
                        omniClient.cmd('getrawtransaction', transaction, (err, rawTransaction) => {
        
                            console.log('rawTransaction: ', rawTransaction);
        
                            if(rawTransaction) {
                                const rawTransactionObj = {
                                    rawTransaction
                                }

                                blockTransactionArr.push(rawTransactionObj)
        
                                redisClient.setex(blockTxnRedisKey, 3306, JSON.stringify(blockTransactionArr));

                                console.log('rawTransactionObj: ', rawTransactionObj)
                            }
                        })
                    })
                }
            })
        }
    });

    
}

module.exports = {
    blockTransactionsModule,
}