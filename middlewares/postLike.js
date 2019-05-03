/**
 * Post like middleware
 * Author: samueladewale
*/

const { createLikedPost, getUserLikedPost, removeLikedPost } = require('./../services/likedPost')
const { getPost, decreasePostLikes, increasePostLikes } = require('./../services/post')
const { getUserWithId } = require('./../services/user')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const Log = require('./../modules/logging')

/**
 * Liking or unliking a post
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function postLike(req, res) {
	const log = new Log(req)	

	// Checking if all the required params are correct
	if (!req.body.postId || !req.body.postId.trim() === '') {
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

	// Registering the like
	try {
		let post
		let postLike

		// Checking if the user already like the post
		const likedPost = await getUserLikedPost(data)
		if ( !likedPost ) {
			post = await getPost(data)
			postLike = await createLikedPost(user, post)
			await increasePostLikes(data)
			log.info("Post like registered")
		}else {
			// Unliking the post
			postLike = await removeLikedPost(data)
			await decreasePostLikes(data)
			log.info("Post unliked")
		}
		res.sendStatus(200)

	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

}

module.exports = postLike 