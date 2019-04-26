/**
 * Relation following middleware
 * Author: samueladewale
*/
const { getAllFollowings } = require('./../services/relation')
const Log = require('./../modules/logging')

/**
 * Get a users following
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function relationFollowing(req, res) {
	const log = new Log(req)	

	// Checking if all the required params are correct
	if (!req.params.username || !req.params.username.trim() === '' || 
		!req.params.page || !req.params.page.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	const data = req.params
	const page = req.params.page

	// Getting the users followings
	try {
		const followings = await getAllFollowings(data, page)
		res.json(followings)
		log.info('Got all followings')

	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	} 

}

module.exports = relationFollowing