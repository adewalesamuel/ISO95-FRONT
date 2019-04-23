/**
 * User profile update middleware
 * Author: samueladewale
*/

const { updateUser } = require('./../services/user')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const Log = require('./../modules/logging')

/**
 * Updates the connected users info
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function userProfileUpdate(req, res) {
	const log = new Log(req)	

	// Checking if all the required fields in the body are correct
	if (!req.body.email || !req.body.fullname ||
			!req.body.website || !req.body.place || !req.body.tel ||
			!req.body.description) {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}
	
	const data = req.body

	// Verifying if the authorazation token is valid
	try {
		const sessionToken = getAuthorizationBearerToken(req)
		const tokenPayload = getTokenPayload(sessionToken)

		if ( !sessionToken || !isValidToken(sessionToken) || tokenPayload.type !== 'session') {
			res.sendStatus(401)
			log.error('Token is not valid')
			return
		}

		data.id = tokenPayload.id

	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

	// Updating the users infos
	try {
		const hasUpdatedUser = await updateUser(data)
		if ( !hasUpdatedUser ) {
			res.sendStatus(404)
			log.error("User not found")
			return
		}

		res.sendStatus(200)
		log.info("User updated")
	}catch(err){
		res.sendStatus(500)
		log.error(err)
		return
	}

}

module.exports = userProfileUpdate