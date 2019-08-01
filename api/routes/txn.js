const express = require('express')
const txnRouter = express.Router()

txnRouter.post('/', (req,res)=>{
    const {rawTxn} = req.body
    req.omniClient.cmd('sendrawtransaction', rawTxn, (err, data)=>{
        if(err) res.status(500).send('error')
        
        res.send(data)
    })
})

module.exports =  txnRouter 