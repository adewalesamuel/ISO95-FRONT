/**
 * Comment register middleware
 * Author: samueladewale
*/
const { createComment } = require('./../services/comment')
const { increasePostComments } = require('./../services/post')
const { getUserWithId } = require('./../services/user')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const Log = require('./../modules/logging')

/**
 * Registers a post comment
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function commentRegistration(req, res) {
	const log = new Log(req)	

	// Checking if all the required params are correct
	if (!req.body.postId || !req.body.postId.trim() === '' ||
		!req.body.comment || !req.body.comment.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	let user
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

		data.id = tokenPayload.id // The id of the logged in user 

	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

	// Getting the logged in user info
	try {
		user = await getUserWithId(data)
		log.info("Got user")
	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

	// Creating the user post comment
	try {
		await createComment(data, user)
		log.info("Comment created")
		res.sendStatus(200)

		await increasePostComments(data)
		log.info("Post comment count inscreased")

	}catch(err){
		res.sendStatus(500)
		log.error(err)
	}
}

module.exports = commentRegistration