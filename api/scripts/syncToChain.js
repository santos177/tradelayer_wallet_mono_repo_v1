var litecoin = require('litecoin');

const {Address, Balance, Property} = require('../models/index.js')


var omniClient = new litecoin.Client({
  host: "localhost",
  port: 9332,
  user: "pepejandro",
  pass: "pepecash",
  ssl: false /* true, */
});

omniClient.cmd("listreceivedbyaddress", 0, true, async function(
  err,
  addresses,
  resHeaders
) {

  const litecoinProp = (await Property.findAll({
    where: {
      name: 'litecoin'
    }
  }))[0]


  addresses.forEach( async (obj)=>{
    const {address, ammount} = obj;
    const newAddress = await Address.create({
      address,
      balances:[ {
       ammount,
       propery_id:  litecoinProp.id
       
      }],
    }, {
      include: [Balance]
    })

    
  })
});
