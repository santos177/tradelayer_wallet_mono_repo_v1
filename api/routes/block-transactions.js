const express = require('express');
const blockTransactionsRouter = express.Router();
const { blockTransactionsModule } = require('./modules/block-transactions-module');
const { redisClient } = require('../redis_client');
const blockTxnModule = require('./modules/blockTxn-module');
const omniClient = require('../ltc_client');

blockTransactionsRouter.get('/:block', (req, res) => {

    const { block } = req.params;
    const transactionBlock = block;

    const blockTransactionArr = [];
    console.log('req block: ', block)

    omniClient.cmd('tl_listblocktransactions', parseInt(block), (err, blockTransactions) => {

        omniClient.cmd('getblockhash', parseInt(block), (err, blockHash) => {

            if(blockTransactions && blockHash) {
                console.log('block transactions: ', blockTransactions)
                blockTransactions.map((blockTransaction, index) => {
                    omniClient.cmd('tl_gettransaction', blockTransaction, (err, blockTransaction) => {

                        if(blockTransaction) {

                            blockTransactionArr.push(blockTransaction)
                        }
                    })
                })

                setTimeout(() => {
                    res.json({
                        block: parseInt(transactionBlock),
                        blockhash: blockHash,
                        count: blockTransactions.length,
                        transactions: blockTransactionArr,
                        isResult: true,
                    })
                }, 600)
            }

        })
    })
})

module.exports = blockTransactionsRouter;
