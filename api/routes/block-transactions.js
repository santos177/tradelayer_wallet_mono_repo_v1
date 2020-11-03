const express = require('express');
const blockTransactionsRouter = express.Router();
const { blockTransactionsModule } = require('./modules/block-transactions-module');
const { redisClient } = require('../redis_client');
const blockTxnModule = require('./modules/blockTxn-module');
const omniClient = require('../ltc_client');

blockTransactionsRouter.get('/:block', (req, res) => {

    const { block } = req.params;

    const blockTransactionArr = [];

    omniClient.cmd('tl_listblocktransactions', block, (err, blockTransactions) => {

        if(blockTransactions) {
            console.log('block transactions: ', blockTransactions)
            blockTransactions.map((blockTransaction, index) => {
                omniClient.cmd('tl_listtransactions', blockTransaction, true, (err, blockTransaction) => {

                    if(blockTransaction) {
                        const blockTransactionObj = {
                            blockTransaction
                        }

                        blockTransactionArr.push(blockTransactionObj)
                    }
                })
            })

            setTimeout(() => {
                res.json({
                    isResult: true,
                    data: blockTransactionArr
                })
            }, 600)
        }
    })
})

module.exports = blockTransactionsRouter;