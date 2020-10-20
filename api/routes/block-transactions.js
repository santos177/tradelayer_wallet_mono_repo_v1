const express = require('express');
const blockTransactionsRouter = express.Router();
const { blockTransactionsModule } = require('./modules/block-transactions-module');
const { redisClient } = require('../redis_client');
const blockTxnModule = require('./modules/blockTxn-module');
const omniClient = require('../ltc_client');

blockTransactionsRouter.get('/:blockhash', (req, res) => {

    const { blockhash } = req.params;
    // const blockTxnRedisKey = 'blockTxnRedisKey';

    // blockTransactionsModule(blockhash)
    // .then(() => {})
    // .then(() => {

    //     redisClient.get(blockTxnRedisKey, (err, result) => {

    //         // if(result && JSON.parse(result).length !== 0) {
    //         //     console.log('result_xxx: ', result)
    //         //     return res.json({
    //         //         isResult: true,
    //         //         data: JSON.parse(result)
    //         //     })
    //         // }
    //         // return res.json({
    //         //     isResult: false,
    //         //     data: [],
    //         // })

    //         blockTxnModule(result)
    //         .then(response => {
    //             res.json(response);
    //         })
    //         .catch(error => {
    //             res.json(error);
    //         })
    //     })
    // })
    // .catch(() => {
    //     return res.json({
    //         isResult: false,
    //         data: [],
    //     })
    // })
    


    // redisClient.get(blockTxnRedisKey, (err, blockTransaction) => {
    //     if((JSON.parse(blockTransaction).length < 1) && (JSON.parse(blockTransaction).length > -1)) {
            
    //         let blockTransactionArr = JSON.parse(blockTransaction);
    //         console.log('blockTransactionArr: ', blockTransactionArr)
            
    //     }
    // });

    const blockTransactionArr = [];

    omniClient.cmd('getblock', blockhash, (err, block) => {

        if(block) {
            const { tx } = block;
            console.log('tx: ', tx)
            tx.map((transaction, index) => {
                omniClient.cmd('getrawtransaction', transaction, true, (err, blockTransaction) => {

                    if(blockTransaction) {
                        const blockTransactionObj = {
                            blockTransaction
                        }

                        blockTransactionArr.push(blockTransactionObj)
                    }
                })
            })

            setTimeout(() => {
                // if(blockTransactionArr && blockTransactionArr > 0) {
                //     res.json({
                //         isResult: true,
                //         data: blockTransactionArr
                //     })
                // }
                // res.json({
                //     isResult: false,
                //     data: blockTransactionArr
                // })
                res.json({
                    isResult: true,
                    data: blockTransactionArr
                })
            }, 600)
        }
    })
})

module.exports = blockTransactionsRouter;