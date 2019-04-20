/**
 * userPasswordTokenGeneration middleware
 * Author: samueladewale
*/
const { getPasswordRenewalToken } = require('./../modules/authentication')
const { getUserWithEmail } = require('./../services/user')
const { sendMail } = require('./../modules/common')
const Log = require('./../modules/logging')

/**
 * Generates a token to renew the users passsword
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
const userPasswordTokenGeneration = async (req, res) => {
	const log = new Log(req)	

	// Checking if important fields are missing from the request body
	if (!req.body.email || req.body.email === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	let data = req.body
	let responseData
	let user

	try {
		user = await getUserWithEmail(data)
		if (!user) {
			res.sendStatus(404)
			log.error("The user was not found")
			return
		}
	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

	try {
		const passwordRenewalToken = getPasswordRenewalToken({id: user._id, email: user.email})
		sendMail(user, passwordRenewalToken)
		res.json({token: passwordRenewalToken})

	}catch(err){
		res.sendStatus(500)
		log.error(err)
		return
	}


}

module.exports = userPasswordTokenGeneration