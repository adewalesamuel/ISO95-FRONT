/**
 * User profile middleware
 * Author: samueladewale
*/

const { getUserWithUsername } = require('./../services/user')
const Log = require('./../modules/logging')

/**
 * Gets the users profile informations
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function userProfile (req, res) {
	const log = new Log(req)	

	// Checking if all the required fields in the body are correct
	if (!req.params.username || req.params.username.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	let data = req.params

	// Getting the user with the username if it exists
	try {
		const user = await getUserWithUsername(data)

		if ( !user ) {
			res.sendStatus(404)
			log.error("Could not find user")
			return
		}

		res.json({
			fullname: user.fullname,
			username: user.username,
			profileUrl: user.profileUrl,
			relations: user.relations,
			description: user.description,
			email: user.email,
			tel: user.tel,
			website: user.website,
			place: user.place,
			grades: user.grades,
			posts: user.posts,
			favorites: user.favorites,
			new: user.new
		})

		log.info("User found")
	}catch(err){
		res.sendStatus(500)
		log.error(err)
		return
	}

}

module.exports = userProfile