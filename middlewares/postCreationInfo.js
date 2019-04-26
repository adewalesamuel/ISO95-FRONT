/**
 * Post creation info middleware
 * Author: samueladewale
*/

const { updatePostInfo } = require('./../services/post')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const Log = require('./../modules/logging')

/**
 * Add informations to an existing post a post
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function postCreationPhoto(req, res) {
	const log = new Log(req)	

	// Checking if all the required body fields are correct
	if (!req.body.publicId || !req.body.photoAlt || !req.body.caption 
		|| !req.body.place || !req.body.camera || !req.body.tags) {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	let data = req.body // portrait or else

	// Verifying if the authorazation token is valid
	try {
		const sessionToken = getAuthorizationBearerToken(req)
		const tokenPayload = getTokenPayload(sessionToken)

		if ( !sessionToken || !isValidToken(sessionToken) || tokenPayload.type !== 'session') {
			res.sendStatus(401)
			log.error('Token is not valid')
			return
		}

		data.id = tokenPayload.id // the id of the logged in user

	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

	// Updating the post info
	try {
		const updatedPost = await updatePostInfo(data) 
		if ( updatedPost.n === 0 ) {
			res.sendStatus(404)
			log.error("User post not found")
			return
		}
		res.sendStatus(200)
		log.info("Post info created")
	}catch(err) {
		log.error(err)
		return
	}

}

module.exports = postCreationPhoto