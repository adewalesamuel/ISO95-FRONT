/**
 * Relation follower middleware
 * Author: samueladewale
*/
const { getAllFollowers } = require('./../services/relation')
const Log = require('./../modules/logging')

/**
 * Get a users followers
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function relationFollower(req, res) {
	const log = new Log(req)	

	// Checking if all the required fields in the body are correct
	if (!req.params.username || !req.params.username.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	const data = req.params

	// Getting the users followers
	try {
		const followers = await getAllFollowers(data)
		res.json(followers)
		log.info('Got all followers')

	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	} 

}

module.exports = relationFollower