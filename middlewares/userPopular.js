/**
 * User popular middleware
 * Author: samueladewale
*/

const { getPopularUsers } = require('./../services/user')
const Log = require('./../modules/logging')

/**
 * Gets the most active and popular users
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function userPopular (req, res) {
	const log = new Log(req)	

	// Checking if all the required params are correct
	if (!req.params.page || req.params.page.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	const page = req.params.page

	// Getting the users
	try {
		const users = await getPopularUsers(page, 8)

		if ( !users ) {
			res.sendStatus(404)
			log.error("Could not any find users")
			return
		}

		res.json({...users})
		log.info("Users found")
	}catch(err){
		res.sendStatus(500)
		log.error(err)
		return
	}

}

module.exports = userPopular