/**
 * Post display info middleware
 * Author: samueladewale
*/

const { getPostById } = require('./../services/post')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const Log = require('./../modules/logging')

/**
 * Display a post by its public id
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function posyDisplay(req, res) {
	const log = new Log(req)	

	// Checking if all the required params are correct
	if (!req.params.publicId || !req.params.publicId.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	let data = req.params // portrait or else

	// Gettings a post
	try {
		const post = await getPostById(data) 
		if ( !post ) {
			res.sendStatus(404)
			log.error("The post does not exist")
			return
		}
		res.json(post)
		log.info("Got post")
	}catch(err) {
		log.error(err)
		return
	}

}

module.exports = posyDisplay