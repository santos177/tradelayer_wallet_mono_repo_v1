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

const userApi = ({omniClient, ...app}) => {
  // post challengeWallet
  // input: encrypted challenge
  // behavior: inserts pchallenge for session into db
  app.post('/api/postChallenge', function(req, res) {
  	//validate uuid
  	var session = crypto.createHash('sha256')
  	var salt = crypto.createHash('sha256')
  	var uuid = req.body.uuid.toString()
  	const uuid_valid = uuid_validate(uuid)
  	//create session
    const hash_seed = config.SESSION_SECRET + uuid
  	session = session.update(hash_seed)
  	session = session.digest('hex')
  	console.log('session is, ', session)
  	//create salt
  	salt = salt.update(hash_seed)
  	salt = salt.digest('hex')
  	//create pow_challenge
  	var pow_challenge = bcrypt.genSaltSync()
  	//create challenge
  	var challenge = bcrypt.genSaltSync()

  	//create query
  	var myquery = "with upsert as (update sessions set challenge=$1, pchallenge=$2, timestamp=DEFAULT where sessionid=$3 returning *) insert into sessions (sessionid, challenge, pchallenge) select $4,$5,$6 where not exists (select * from upsert)"
  	//(challenge, pow_challenge, session, session, challenge, pow_challenge)
  	client.query({
  		text: myquery,
  		values:[
  			challenge,
  			pow_challenge,
  			session,
  			session,
  			challenge,
  			pow_challenge
  		]
  	}, (err, result) => {
  		if(err){
  			console.log('upsert messed up', err)
  			res.send(err)
  		}
  		//if there's no error in upsert, then let's return our objects
  		response = {
        'salt': salt,
        'pow_challenge': pow_challenge,
        'challenge': challenge
    	}
  	  	res.send(response)
  	})
  })

  // post get new address
  // TODO: send this encrypted later
  app.post('/api/postNewAddress', function(req, res) {
    const uuid = req.body.uuid
    var fromAddr = "mhEggMLy9fKundKgfDZZ5R3Jhuhvfxejcn"
    console.log('this is uuid in postNewAddress', uuid)

    helpers.getNewAddress(uuid.toString())
     .then(function whenOk(address) {
        console.log('Address', address)
        var jsonAddress = {address: address}
        var toAddr = address.toString()
        //console.log('this is the correct sendgrant after new address  ')
        //console.log('from address ', fromAddr)
        //console.log('to addr ', toAddr)

        //var grantCommand = path+"/litecoin-cli -datadir="+ datadir +" tl_sendgrant "+fromAddr +" "+ toAddr + " 4 1000000"
        //console.log('this is grant command ', grantCommand)
        //omniClient.cmd('tl_getcontract_orderbook', contractID, 1, function whenOK(error, buyResp, resHeaders){
        // exec(grantCommand, function (error, stdout, stderr) {
        //  if (error === null) {
        //omniClient.cmd('tl_sendgrant', fromAddr, toAddr, 4, "1000000", function whenOK(error, granted, resHeaders){
          //if (error  === null) {
            //console.log('this is result from granted ', granted)
            res.send(JSON.stringify({'address': address}))
          //}
          //else {
          //console.log('something went wrong in tl_sendgrant ', error)
            //res.send(error)
          //}
        //})
      })
      .catch((err) => {
        res.send(err)
      })
  })
  // post createWallet
  // input:uuid, email, nonce, public_key, wallet
  // output: empty success
  // requirements: config.SESSION_SECRET, config.LOCALDEVBYPASSDB, hashlib.sha256?
  // behavior: validate UUID.  create session sha256 hash ...if uuid + secrete challenge is passed
  // writes new wallet info using writeWallet(uuid, wallet, email)
  // on success, sends welcome email
  // notes: config.LOCALDEVBYPASSDB
  // this is process to complete challenge without querying db
  app.post('/api/postCreateWallet', function(req, res) {
   	const email = req.body.email
  	const encrypted_wallet = req.body.encryptedWallet
  	const uuid = req.body.uuid
  	const password = req.body.password
  	const public_key = req.body.publicKey
  	const uuid_valid = uuid_validate(uuid)
  	const jwtPrivateKey = fs.readFileSync('./private.key')
  	const jwtPublicKey = fs.readFileSync('./public.key')

  	console.log('postcreatewallet email,', email)
  	console.log('postcreatewallet encrypted_wallet', encrypted_wallet)
  	console.log('postcreatewallet uuid', uuid)
  	console.log('uuid_valid we are sending to Exists ', uuid)

  	bcrypt.genSalt(parseInt(config.SALT_ROUNDS, 10), function (err, salt) {
  		if (err) {
  			console.log('error in genSalt', err)
  			res.send(err)
  		}
  		console.log('in genSalt')
  		bcrypt.hash(password, salt, null, function (err, passhash) {
  			if (err) {
  				console.log('error in bcrypt hash', email)
  				res.send(err)
  			}
  			console.log('in hash')
  			// write wallet
        // helpers.getNewAddress(uuid)
        //  .then(function whenOk(address) {
        //    console.log('Address', address)

  			    var writeWallet= helpers.writeWallet(uuid, passhash, encrypted_wallet, email)
  			    writeWallet.then((resultWriteWallet) => {
  					console.log('email being sent to send wallet Email', email)
              // send grant

  						// send email
  						helpers.sendWelcomeEmail(email, uuid)
  						//create jwt signature and return token to be saved in client browser
  						const now = Date.now()
              console.log('this is now ', now)
              var i  = 'TradeLayer'          // Issuer
              var s  = uuid      // Subject
              var a  = 'http://tradelayer.org' // Audience
              var signOptions = {
                issuer:  i,
                subject:  s,
                audience:  a,
                expiresIn:  "1h",
                algorithm:  "RS256"   // RSASSA [ "RS256", "RS384", "RS512" ]
              }
              var token = jwt.sign(
                {uuid: uuid},
                jwtPrivateKey,
                signOptions)
              var jsonResponse = {
                token: token
              }
              console.log('token from jwt', token)
              res.send(JSON.stringify(jsonResponse))
            })
            .catch((err) => {
    							console.log('error from writeWallet or signing token ', err)
    							res.send(err)
    				})
        	// }) // end of write wallet then
          .catch((err) => {
      			console.log('error in create wallet promise', err)
      			res.send(err)
      		})
  		}) //end bcrypt hash
  	}) //end genSalt
  }) //end postCreateWallet

  // getUUIDCreate
  // input none
  // behavior : generates UUID using uuid()
  // output: returns uuid
  app.get('/api/getUUIDCreate', (req, res) => {
  	var my_uuid = uuidv4()
  	console.log('we are in backend getUUIDcreate')
  	uuidObj = {
  		uuid: my_uuid.toString()
  	}
  	console.log('my uuid', uuidObj)
  	res.send(uuidObj)
  })

  // postUUIDvalidate
  // input: uuid
  // behavior: validates uuid using uuid_validate
  // return true or false value
  app.post('/api/postUUIDValidate', (req, res) => {
  	var my_uuid = req.body.uuid
  	console.log('uuid in post uuidvalidate', my_uuid)
  	if(my_uuid){
  		var is_valid = uuid_validate(my_uuid)
  		res.send(is_valid)
  	} else {
  		res.send('no uuid sent')
  	}
  })
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
  				var query1 = client.query({
  					text: 'select email, passhash, walletblob from wallets where walletid=$1',
  					values: [uuid],
  					rowMode: 'array' })
  					.then((result) => {
  						// return walletblob
  						console.log('result of read wallet result.rows[0] ', result.rows[0])
  						resolve(result.rows[0])
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
  					console.log('passhash that db query returns in wallet login', data[1])
  					if(data[1] ==! passhash_generated){
  						console.log('invalid login')
  						res.send('invalid login')
  					} else {
  		  		var question = ''
  					console.log('data after readWallet', data)

  					// create payload
  					var payload = {
  						'walletEncrypted': data[2].toString(),
  						'email': data[0].toString(),
  		      	'asq': question
  					}

  					var privateKEY  = fs.readFileSync('./private.key', 'utf8');
  					var publicKEY  = fs.readFileSync('./public.key', 'utf8');

  					var i = 'TradeLayer'  //issuer
  					var s = uuid.toString() //subject
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

  // Update WalletBlob
  // inputs: uuid, encrypted walletBlob
  app.post('/api/postUpdateWalletBlob', (req, res) => {
    var walletId = req.body.uuid
    var newWalletBlob = req.body.encryptedWallet
    console.log('walletBlob on postUpdateWalletBlob', newWalletBlob)

    var promiseWalletBlobUpdate = new Promise((resolve, reject) => {
      var query1 = client.query({
        text: 'update wallets set walletBlob = $1 where walletId = $2',
        values: [newWalletBlob, walletId],
        rowMode: 'array'
      })
      .then((result) => {
        console.log('result of walletBlob update ', result)
        resolve('successful update')
      })
      .catch((err) => {
        console.log('err in walletBlob update ', err)
        reject(err)
      })
    }) // end of promise
    .then((data) => {
      console.log('result of walletBlob promise', data)
      var jsonResp = {
        status: data.toString()
      }

      console.log('response to front end ', jsonResp)
      res.send(JSON.stringify(jsonResp))
    }) // end of then
    .catch((err) => {
      console.log('error in walletBlob update promise', err)
      var jsonResp = {
        status: err.toString()
      }
      res.send(jsonResp)
    }) // end of catch
  })

  return app
}

module.exports = userApi
