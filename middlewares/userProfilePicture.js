/**
 * User profile picture middleware
 * Author: samueladewale
*/

const { updateUserProfileUrl, getUserWithId } = require('./../services/user')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const { uploadImage, resizeImage, deleteImage } = require('./../modules/file')
const Log = require('./../modules/logging')

/**
 * Updates the connected users info
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function userProfilePicture(req, res) {
	const log = new Log(req)	
	log.info('userProfilePicture')

	let data = {}
	let user
	const profilePicPath = 'uploads/profiles'

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

	// Checking if there is a profile picture
	try {
		user = await getUserWithId(data)
		
		if ( user.profileUrl !== '' || user.profileUrl.trim() !== '') {
			// Getting the filename of the existing profile picture from the profile picture url
			data.filename = user.profileUrl.split('/')[user.profileUrl.split('/').length - 1]
			log.info('File exists')
		}else {
			// Generating a random filename for the profile picture
			data.filename = `${user.username}-${Math.round(new Date().getTime() * (Math.random() * 1000))}.jpg`
			log.info('File doesnt exist')
		}
	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

	// Uploading users profile picture
	try {
		const uploadedImage = await uploadImage(req, profilePicPath, data.filename)
		res.sendStatus(200)
		log.info("Uploaded Image" + uploadedImage)

		const hasResizedImage = await resizeImage(uploadedImage, `${profilePicPath}/${data.filename}`, 200, 200)
		log.info("Resized image" + `${profilePicPath}/${data.filename}`)

		const hasUpdatedProfile = await updateUserProfileUrl(data)
		log.info("Profile pic updated")
		
		deleteImage(uploadedImage)
		log.info("Image deleted")
	}catch(err){
		res.sendStatus(500)
		log.error(err)
		return
	}

}

module.exports = userProfilePicture