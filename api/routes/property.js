const express = require('express')
const propertyRouter = express.Router()

propertyRouter.get('/listproperties', (req,res)=>{
    req.omniClient.cmd('tl_listproperties', (err, properties)=>{
        console.log(err, properties);
        
        res.send(properties)
    })
})

propertyRouter.get('/listNatives', (req,res)=>{
    req.omniClient.cmd('tl_list_natives', (err, contracts)=>{
        if(err){
            res.send(err.toString())
        } else {
            res.send(contracts)
        }       
    })
})

propertyRouter.get('/listOracleContracts', (req,res)=>{
    req.omniClient.cmd('tl_list_oracles', (err, contracts)=>{
        if(err){
            res.send(err.toString())
        } else {
            res.send(contracts)
        }       
    })
})

propertyRouter.get('/getproperty/:id', (req, res)=>{
    let {id} = req.params
    id = +id    
    req.omniClient.cmd('tl_getproperty', id, (err, properties)=>{
        console.log(err, properties);
        
        res.send(properties)
    }) 
})


module.exports =  propertyRouter 
