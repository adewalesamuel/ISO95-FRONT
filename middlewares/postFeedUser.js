/**
 * Post display user feed info middleware
 * Author: samueladewale
*/

const { getUsersPosts } = require('./../services/post')
const { getAllFollowingsById } = require('./../services/relation')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const Log = require('./../modules/logging')

/**
 * Display a user post feed
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function postFeedUser(req, res) {
	const log = new Log(req)

	// Checking if all the required params are correct
	if ( !req.params.page || !req.params.page.trim() === '' ) {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	let data = {}
	const page = req.params.page

	// Verifying if the authorization token is valid
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

	// Gettings the users feed
	try {
		const followings = await getAllFollowingsById(data) 
		let ids = followings.map( item => item.following._id )

		if ( !followings || followings.length < 1 ) {
			res.sendStatus(404)
			log.error("Not following any users")
			return
		}

		const postFeed = await getUsersPosts(ids, page)
		res.json(postFeed)
		log.info("Got post feed")
	}catch(err) {
		log.error(err)
		return
	}

}

module.exports = postFeedUser