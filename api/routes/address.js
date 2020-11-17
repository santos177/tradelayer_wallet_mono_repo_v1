const addressRouter = require('express').Router();
const omniClient = require('../ltc_client');


Router.get('/search/:address', (req, res) => {

    const { address } = req.params;

    const searchAddressArr = [];

    omniClient.cmd('tl_getallbalancesforaddress', address, (err, addressData) => {
        
        if(addressData) {

            searchAddressArr.push(addressData);

            addressData.map((addressDataProp, index) => {

                omniClient.cmd('tl_getallbalancesforid', addressDataProp.propertyid, (err, propertyData) => {

                    if(propertyData) {

                        searchAddressArr.push(propertyData);
                    }
                })
            })

            setTimeout(() => {
                res.json({
                    isData: true,
                    address,
                    data: searchAddressArr,
                })
            }, 600)
        }
        res.json({
            isData: false,
        })
    })
})

module.exports = addressRouter;