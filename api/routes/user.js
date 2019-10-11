var { dbconnect } = require('../dbconnect')
const client = dbconnect
const jwt  = require('jsonwebtoken');
const helpers = require('../helpers')
const config = require('../config')
const uuidv4 = require('uuid/v4');
const uuid_validate = require('uuid-validate')
const crypto = require('crypto')
const bcrypt = require('bcrypt-nodejs')
var bodyParser = require('body-parser');
var asynco = require('async');
// console.log("DATA "+ JSON.stringify(asynco))
var dns = require("dns");
var exec = require('child_process').exec;
const execSync = require('child_process').execSync;
var WebSocketServer = require('ws').Server;
var dgram = require('dgram');
var udpserver = dgram.createSocket('udp4');
var fs = require('fs')

var path= config.TLPATH
var datadir = config.TLDATADIR
const {Wallet} = require('../models/index.js') 

const Sequelize = require("sequelize");

const userApi = ({omniClient, ...app}) => {


  // get getAuthenticate
  // this takes token and verifies
  app.get('/api/getAuthenticate', (req, res) => {

  	const token = req.body.token
  	var i = 'TradeLayer'  //issuer
  	var s = req.body.uuid.toString() //subject
  	var a = 'http://www.tradelayer.org'  //audience
  	var publicKEY  = fs.readFileSync('./public.key', 'utf8');

  	var verifyOptions = {
   		issuer:  i,
   		subject:  s,
   		audience:  a,
   		expiresIn:  "1h",
   		algorithm:  ["RS256"]
  	}

  		var legit = jwt.verify(token, publicKEY, verifyOptions)
  		console.log("\nJWT verification result: " + JSON.stringify(legit))

  		if(legit){
  			res.send(JSON.stringify(legit))
  		} else {
  			res.send(false)
  		}
  })
  // post WalletLogin
  // returns Question if successful
  app.post('/api/postWalletLogin', (req, res) => {
  	// TODO: make conditional IF statements for uuid
    var validate_uuid = uuid_validate(req.body.uuid)
		var uuid = req.body.uuid

  	var password = req.body.password
  	console.log('in wallet login')

  	// TODO: implement promises of helper functions
    // 	var walletExists = helpers.exists(uuid)
  	// 	check if wallet exists
  	// TODO: implement MFA later
  	// mfa_verified,mfa = verify_mfa(uuid,mfatoken)
  	bcrypt.genSalt(parseInt(config.SALT_ROUNDS, 10), function (err, salt) {
  		if (err) {
  			console.log('error in genSalt', err)
  			res.send(err)
  		}
  		console.log('in wallet Login genSalt')

  		bcrypt.hash(password, salt, null, function (err, passhash_generated) {
  			if (err) {
  				console.log('error in bcrypt hash', email)
  				res.send(err)
  			}

  			console.log('begin readWallet')
  			var promiseWalletEncrypted = new Promise((resolve, reject) => {

					// Wallet.findAll({
					// 	where: { $or: [
					// 		{
					// 				email: uuid
					// 		}, 
					// 		{
					// 				email: uuid

					// 			}
					// 		]
					// 	}
					// })

					Wallet.findAll({
						where: {
							[Sequelize.Op.or]: [{email: uuid}, {walletid:uuid}]
						},
						limit: 1
					})
  				// var query1 = client.query({
  				// 	text: 'select email, passhash, walletblob from wallets where walletid=$1',
  				// 	values: [uuid],
					// 	rowMode: 'array' })
						

  					.then((result) => {
  						// return walletblob
  						console.log('result of read wallet result.rows[0] ', result)
  						resolve(result[0])
  					})
  					.catch((err) => {
  							console.log('error in read wallet')
  							reject(err)
  					})
  				}) //end of promiseWalletEncrypted
  				.then((data) => {
  					//	console.log('begin helpers.updateLogin')
  					// TODO: fix this
  					// helpers.updateLogin(uuid)
  					// get question
						console.log('passhash that db query returns in wallet login', data.dataValues)
						const dataValues = data.dataValues;
  					if(dataValues.passhash ==! passhash_generated){
  						console.log('invalid login')
  						res.send('invalid login')
  					} else {
  		  		var question = ''
  					console.log('data after readWallet', data)

  					// create payload
  					var payload = {
  						'walletEncrypted': dataValues.walletblob.toString(),
  						'email': dataValues.email.toString(),
  		      	'asq': question
						}
						console.log('PAYLOD', payload);
						

  					var privateKEY  = fs.readFileSync('./private.key', 'utf8');
  					var publicKEY  = fs.readFileSync('./public.key', 'utf8');

  					var i = 'TradeLayer'  //issuer
  					var s = dataValues.walletid.toString() //subject
  					var a = 'http://www.tradelayer.org'  //audience

  					// signing options
  					var signOptions = {
  						issuer: i,
  						subject: s,
  						audience: a,
  						expiresIn: '1h',
  						algorithm:  "RS256"
  					}

  					var token = jwt.sign(payload, privateKEY, signOptions)

  					var jsonResp = {
  						token: token
  					}

  					console.log('response to front end ', token)
  		  		res.send(JSON.stringify(jsonResp))
  					}
  				})
  				.catch((err) => {
  					console.log('error in wallet login promise ', err)
  					res.send(err)
  				})
  			})
  		})
  })


  return app
}

module.exports = userApi
