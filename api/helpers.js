// helpers.js
const uudiv4 = require('uuid/v4');
const uuid_validate = require('uuid-validate')
const testuuid = 'd6056254-2b5d-4a78-a8d0-ed5326035d04'
const config = require('./config')
const nodemailer = require('nodemailer')
const multiline = require('multiline')
var justify = require('justify');
var crypto = require('crypto')
var hash = crypto.createHash('sha256')
var rightAlign = require('right-align');

// db client
const { Client } = require('pg')
const { dbconnect } = require('./dbconnect')
const client = dbconnect

const {Wallet} = require('./models/index.js') 
var litecoin = require('litecoin')

var omniClient = new litecoin.Client({
  host: 'localhost',
  port: 9332,
  user: "pepejandro",
  pass: "pepecash",
})


module.exports = {
// encrypts to AES
// input: value to encrypt
// output object which is boolean value of encryption success, encrypted value
encrypttoAES: (value) => {
	var aesKey = config.AESKEY
	var aesIV = config.AESIV
	var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv);
	var justify_width = int((((value.length)/16) + 1) * 16)

	console.log('justify int value', justify)

	var message = justify('',value, justify_width)

	console.log('aes message', message)
	var messageBytes = aesjs.utils.utf8.toBytes(message);
	var encrypted = aesCbc.encrypt(messageBytes)
	// TODO: add try catch to return failures
	return {success: true, encrypted: encrypted}

},
// decrypt from AES
// input: value
// output object which is success value of decryption, and the unencrypted value
decryptfromAES: (encryptedBytes) => {
	var aesKey = config.AESKEY
	var aesIV = config.AESIV
	var aesCbc = new aesjs.ModeOfOperation.cbc(key, iv)
	var decryptedBytes = aesCbc.decrypt(encryptedBytes)
	// Convert our bytes back into text
	var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
	console.log('decrypted text', decryptedText)

	return {success: true, decrypted: decrypted}
},
// readWallet
// input: uuid
// output: walletblob
readWallet: (uuid) => {
	console.log('in read wallet')
  var query1 = client.query({
		text: 'select walletblob from wallets where walletid=$1',
		values: [uuid],
		rowMode: 'array' })
		.then((result) => {
			//return walletblob
			console.log('result of read wallet result.rows[0], ', result.rows[0])
			return result.rows[0]
		})
		.catch((err) => {
			return err
		})
},
// updateLogin
updateLogin: (uuid) => {
	var query1 = client.query({
		text: 'update wallets set lastlogin=DEFAULT where walletid=$1',
		values: [uuid],
		rowMode: 'array' })
		.then((result) => {
			return 'Update Success'
		})
		.catch((err) => {
			return err
		})
},
// getSetting
getSetting: (uuid,key) => {
	var ret
  var settings = readSettings(uuid)
  ret = settings[key]['value']
  return ret
},
// setSetting
setSetting: (uuid,key,value) => {
	var ret = false
  var time = str(datetime.now())
  var settings= readSettings(uuid)
	console.log(settings)
    if(settings[key]['created_at']) {
      settings[key]= {'value':value,'updated_at':time,'created_at':settings[key]['created_at']}
    } else {
      settings[key]= {'value':value,'updated_at':time,'created_at':time}
    	ret= write_settings(uuid,settings)
	}
  return ret
},
// readSettings
readSettings: (uuid) => {
	var settings={}
	var query1 = client.query({
		text: 'select settings from wallets where walletid=$1',
		values: [uuid],
		rowMode: 'array'
	}).then((result) => {
		if (!result.rows[0].length()) {
	    settings = result.rows[0]
			//json parse
			settings = JSON.parse(settings)
		}
	}).catch((err) => {
		return err
	})
	//return json object of settings
	return settings

},
// writeSettings
writeSettings: (uuid, towrite) => {
	var settings = {}
	if (typeof(towrite) === undefined){
		settings=towrite
	} else {
		settings=JSON.parse(towrite)
	}

	var query1 = client.query({
		text: 'update wallets set settings=$1 where walletid=$2',
		values: [settings, uuid],
		rowMode: 'array'
	})
	.then((result) => {
		console.log('wrote settings')
		return true
	})
	.catch((err) => {
		console.log('wrote no settings')
		return false
	})

},
// verify login challenge
failedChallenge: (pow_challenge, nonce, difficulty) => {
  // sha256 hex digest the pow_challenge + nonce to get pow_challenge_response
  const hash_seed = pow_challenge + nonce
	console.log('pow challenge in failed Challenge', pow_challenge)
	console.log('nonce in failed Challenge', nonce)
	console.log('hash_seed in failed Challenge', hash_seed)
  var pow_challenge_response = hash.update(hash_seed)
  pow_challenge_response = hash.digest('hex')
  // start pos for response array
  var start_pos = pow_challenge_response.length - difficulty.length
  console.log('starting pos', start_pos)
  var difficulty_num = parseInt(difficulty)
  //starting from the end, the difficulty level len byte should be equal to the difficulty string
  if(parseInt(pow_challenge_response[start_pos]) === difficulty_num){
    console.log('it matches')
    //return that it did NOT fail
    return false
  }
  else{
    //return that it DID fail
    return true
  }
  console.log('test failed challenge ')
},
// exists - check if walletid already exists

// writeWallet
writeWallet: (uuid, passhash, wallet, email="nothing") => {
	console.log('in write wallet')
   // for write wallet with upsert...dont do this!!! because they can change password by just creating with same uuid
	 // this should check for dups
	return new Promise((resolve, reject) => {
    console.log('in promise of write wallet')
        Wallet.create({
          walletid: uuid,
          walletblob: wallet,
          passhash,
          email
        })
  			.then((result) => {
    			// return success for writing wallet
					console.log('success in write wallet', result)
    			resolve(true)
  			})
  			.catch((err) => {
    			// return failure for writing wallet
					console.log('error in write wallet', err)
    			reject(err);
  			})
		})
},//end of writeWallet
walletExists: (uuid) => {

	return new Promise((resolve, reject) => {
  // validate uuid
	console.log('in wallet exists')
  var validated_uuid = uuid_validate(uuid)
  var query = client.query({
    	text: 'select walletid from wallets where walletid = $1',
    	values: [uuid],
    	rowMode: 'array'
  	})
  	.then((res) => {
    	if(res)
    	{
      	console.log('exists this wallet id ', res)
      	resolve(true)
    	}
    	else {
      	console.log('walletid doesnt exist ' , res)
      	resolve(false)
    	}
  	})
  	.catch((err)=>{
    	console.log('ERROR IN WALLET ID EXISTS' + uuid + ' '  + err)
    	reject(err)
  	})
	})
},
  // sendEmail
sendWelcomeEmail: (email, uuid) => {
  // create test transporter
  nodemailer.createTestAccount((err, account) => {
    var transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: account.user, // generated ethereal user
        pass: account.pass // generated ethereal password
      }
    }) //end var transporter
		console.log('email inside send email', email)
    // set mail OPTIONS
    var mailOptions ={
      from: '"Desk" <desk@tradelayer.org>', // sender address
      to: email, //list of receivers, cma separated
      subject: 'Welcome to TradeLayer!',
      text: multiline(()=>{/*
				Welcome To TradeLayer!\n
             \n
            Thank you for creating a new wallet and choosing to join the exciting world of cryptocurrency.\n
            While we know you are eager to get started, this email contains important information about your new TradeLayer.\n
            So please take a ment to read through it completely.\n
             \n
            Your Wallet Login Details
            This is your Wallet ID: +str(uuid)+\n
            Never share your Wallet ID or Password with anyone. Be sure to keep them safe and stored separately for security.\n\n
            This is your unique Login Link: https://www.tradelayer.org/login/+str(uuid)+\n
            Bookmark this, you can use it to login directly to your TradeLayer with your password.\n
            \n
            TradeLayer NEVER STORES Your Password.\n
            This means you need your password to access your wallet and the private keys within.\n
            If you lose or forget your password there is nothing we can do to recover it.\n
            This may result in the loss of funds in any wallet addresses which have not been Backed Up!\n\n
            Please, Please, Please Keep Your Password Safe!\n
            \n
            Important Information On Backing Up Your Wallet
            If you lose or forget your password the only thing you can use to recover your funds is a Wallet Backup.\n
            You should create a new backup any time you make a change to your wallet (add/remove an address).\n
            Remove the old backup only after you have confirmed the contents of the new backup are cplete.\n
            On the "My Addresses" page you can export a backup of your wallet under the "Wallet Options" button.\n
            This backup file contains every address and private key (if known) for the addresses in your wallet at the time of backup.\n
            Store your backup file in a secure place. Anyone with access to this file has access to your funds.
            \n
            Thank you for taking the time to read this introduction. \n
            This as well as many more questions/answers are available on our FAQ Page \n
            If you have any questions please feel free to reach out to us using the information on our Contact Us page: \n
            \n
            Sincerely, \n The TradeLayer Team
          */}),
      html: multiline(()=>{/*
            <html><head></head><body style="background-color:rgba(234, 235, 236, 0.43);">
            <h1><font color="#034F92">Welcome To TradeLayer!</font></h1>
            <p>
            Thank you for creating a new wallet and choosing to join the exciting world of cryptocurrency.<br>
            While we know you are eager to get started, this email contains important information about your new TradeLayer.<br>
            So please take a ment to read through it cpletely.<br>
            </p>
            <h2><font color="#034F92">Your Wallet Login Details</font></h2>
            <p>
            This is your <b>Wallet ID:</b> +str(uuid)+<br>
            Never share your Wallet ID or Password with anyone. Be sure to keep them safe and stored separately for security.<br><br>
            This is your unique <b>Login Link:</b> <a href="+str(uuid)+"></a><br>
            Bookmark this, you can use it to login directly to your TradeLayer with your password.<br>
            </p><p>
            <strong>TradeLayer Never Stores Your Password.</strong><br>
            This means you need your password to access your wallet and the private keys within.<br>
            If you lose or forget your password there is nothing we can do to recover it.<br>
            This may result in the loss of funds in any wallet addresses which have not been Backed Up!<br><br>
            <strong>Please, Please, Please Keep Your Password Safe!</strong><br>
            </p>
            <h2><font color="#034F92">Important Information On Backing Up Your Wallet</font></h2>
            <p>
            If you lose or forget your password the only thing you can use to recover your funds is a Wallet Backup.<br>
            You should create a new backup any time you make a change to your wallet (add/remove an address).<br>
            Remove the old backup only after you have confirmed the contents of the new backup are cplete.<br>
            On the "My Addresses" page you can export a backup of your wallet under the "Wallet Options" button.<br>
            This backup file contains every address and private key (if known) for the addresses in your wallet at the time of backup.<br>
            <strong>Store your backup file in a secure place. Anyone with access to this file has access to your funds.</strong>
            </p><p>
            Thank you for taking the time to read this introduction. <br>
            This as well as many more questions/answers are available on our <a>FAQ</a> page.<br>
            If you have any questions please feel free to reach out to us using the information on our <a href="">Contact Us</a> page.<br>
            </p><p>
            Sincerely, <br><i> The TradeLayer Team</i>
            </p></body></html>
          */})
    }

    //transporter.sendMail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }) //end of sendMail
    }) //end of createTestAccount
  }, //end of sendWelcomeEmail

  getNewAddress: (uuid) => {

	  return new Promise((resolve, reject) => {
			omniClient.cmd('getnewaddress', uuid, function(err, address, resHeaders){
			  if (err) {
          console.log(err);
          reject(err)
        }
			  resolve(address);
			});
	  })
  }

}  //end of module.exports
