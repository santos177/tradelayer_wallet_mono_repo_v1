const express = require('express')
const propertyRouter = express.Router()

propertyRouter.get('/', (req,res)=>{
    req.omniClient.cmd('tl_listproperties', (err, properties)=>{
        console.log(err, properties);
        
        res.send(properties)
    })
})

propertyRouter.get('/:id', (req, res)=>{
    let {id} = req.params
    id = +id    
    req.omniClient.cmd('tl_getproperty', id, (err, properties)=>{
        console.log(err, properties);
        
        res.send(properties)
    }) 
})


module.exports =  propertyRouter 