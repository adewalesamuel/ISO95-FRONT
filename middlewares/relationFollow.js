/**
 * Relation follow middleware
 * Author: samueladewale
*/
const { isValidToken, getAuthorizationBearerToken, getTokenPayload } = require('./../modules/authentication')
const { getUserWithId, increaseUserFollowers, increaseUserFollowings } = require('./../services/user')
const { createRelation, getRelation } = require('./../services/relation')
const Log = require('./../modules/logging')

/**
 * Creates a relation of a user
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function relationFollow(req, res) {
	const log = new Log(req)	

	// Checking if all the required fields in the body are correct
	if (!req.body.id || !req.body.id.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	const userToFollow = req.body
	let user = {}

	// Verifying if the authorization token is valid
	try {
		const sessionToken = getAuthorizationBearerToken(req)
		const tokenPayload = getTokenPayload(sessionToken)

		if ( !sessionToken || !isValidToken(sessionToken) || tokenPayload.type !== 'session') {
			res.sendStatus(401)
			log.error('Token is not valid')
			return
		}

		if ( tokenPayload.id === userToFollow.id ) {
			res.sendStatus(403)
			log.error('User cannot follow itself')
			return
		}

		user.id = tokenPayload.id // the id of the logged in user

	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

	// Verifying if the user is already a follower
	try {
		const hasRelation = await getRelation(user, userToFollow)
		if (hasRelation){
			res.sendStatus(403)
			log.error('User is already a follower')
			return
		}

	}catch(err){
		res.sendStatus(500)
		log.error(err)
		return
	}

	// Creating the relation
	try {
		const users = await Promise.all([
			getUserWithId(user), 
			getUserWithId(userToFollow)
			])
		if ( !users[1] ) {
			res.sendStatus(404)
			log.error('User not found')
			return
		}
		const relation = await createRelation(users[0], users[1])
		res.sendStatus(200)
		log.info("Relation created")

	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

	// Increasing relations count
	try {
		await Promise.all([
			increaseUserFollowers(userToFollow), 
			increaseUserFollowings(user)
			])
		log.info("Relation count inscreased")
	}catch(err) {
		log.error(err)
	} 

}

module.exports = relationFollow