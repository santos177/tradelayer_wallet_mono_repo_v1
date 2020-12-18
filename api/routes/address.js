const express = require('express');
const addressRouter = express.Router();
const omniClient = require('../ltc_client');


addressRouter.post('/search', (req, res) => {

    const { address } = req.query;

    const searchBalanceArr = [];

    omniClient.cmd('tl_getallbalancesforaddress', address, (err, addressData) => {
        
        if(addressData && addressData.length > 0) {

            addressData.map((addressDataProp, index) => {

                const propertyId = addressDataProp.propertyid;

                omniClient.cmd('tl_getproperty', propertyId, (err, propertyData) => {

                    if(propertyData) {

                        const creationTxId = propertyData.creationtxid;

                        omniClient.cmd('tl_gettransaction', creationTxId, (err, transaction) => {

                            if(transaction) {
                                
                                var balance = {
                                    divisible: transaction.divisible,
                                    frozen: "",
                                    id: propertyId.toString(),
                                    pendingneg: "",
                                    pendingpos: "",
                                    propertyinfo: {
                                        ...transaction,
                                        category: propertyData.category,
                                        creationtxid: propertyData.creationtxid,
                                        ecosystem: "",
                                        fixedissuance: propertyData.fixedissuance,
                                        flags: {},
                                        freezingenabled: "",
                                        issuer: propertyData.issuer,
                                        managedissuance: "",
                                        name: propertyData.name,
                                        rdata: "",
                                        registered: "",
                                        subcategory: propertyData.subcategory,
                                        totaltokens: propertyData.totaltokens,
                                        url: propertyData.url,
                                    },
                                    reserved: addressDataProp.reserve,
                                    symbol: `LC${propertyId}`,
                                    value: addressDataProp.balance
                                }

                                searchBalanceArr.push(balance);
                            }
                        })
                    }
                })
            })

            setTimeout(() => {
                res.json({
                    data: {
                        address: {
                            balance: searchBalanceArr
                        },
                        asset: [],
                        tx: {}
                    },
                    query: address,
                    status: 200
                })
            }, 600)
        }
        res.json({
            isData: false,
        })
    })
})

module.exports = addressRouter;