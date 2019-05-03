/**
 * Comment list middleware
 * Author: samueladewale
*/
const { getPostComments } = require('./../services/comment')
const { getUserLikedComments } = require('./../services/likedComment')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const Log = require('./../modules/logging')

/**
 * Displays the post comments
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function commentListPost(req, res) {
	const log = new Log(req)	

	// Checking if all the required params are correct
	if (!req.params.postId || !req.params.postId.trim() === '' ||
		!req.params.page || !req.params.page.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	const data = req.params
	const page = req.params.page

	// Verifying if the authorization token is valid
	try {
		const sessionToken = getAuthorizationBearerToken(req)
		const tokenPayload = getTokenPayload(sessionToken)

		if ( !sessionToken || !isValidToken(sessionToken) || tokenPayload.type !== 'session') {
			data.id = ''
			log.error('Token is not valid')
		}else {
			data.id = tokenPayload.id // the id of the logged in user
		}

	}catch(err) {
		data.id = ''
		log.info('No token')
	}

	// Getting the post comments
	try {
		let commentList = []

		const postComments = await getPostComments(data, page)
		log.info("Got post comments")

		// If the user is not logged in
		if (data.id === 'null' || !data.id) {
			postComments.forEach( postComment => {
				commentList.push({
        user: {
            _id: postComment.user._id,
            username: postComment.user.username,
            profileUrl: postComment.user.profileUrl
        },
        _id: postComment._id,
        comment: postComment.comment,
        time: postComment.time,
        isLikedByUser: false
				})
			} )
		}else { // User is logged in
			let commentIds = postComments.map( item => item._id )

			// Getting the ids of the comments liked by the user
			const userLikedComments = await getUserLikedComments(data, commentIds)
			let likedCommentsIds = userLikedComments.map( item => item.comment._id )

			postComments.forEach( postComment => {
				let commentLiked = false
				// Chekcing if the post has been liked by the user
				if ( likedCommentsIds.filter( likedCommentId => likedCommentId.toString() === postComment._id.toString() ).length > 0 ) {
					commentLiked = true
				}

				commentList.push({
        user: {
            _id: postComment.user._id,
            username: postComment.user.username,
            profileUrl: postComment.user.profileUrl
        },
        _id: postComment._id,
        comment: postComment.comment,
        time: postComment.time,
        isLikedByUser: commentLiked
				})
			} )

		}
		log.info('Got user liked comments')
		res.json(commentList)
		log.info("Got post comments")
	}catch(err) {
		res.sendStatus(500)
		log.error(err)
		return
	}

}

module.exports = commentListPost