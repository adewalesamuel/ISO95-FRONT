/**
 * Post list user middleware
 * Author: samueladewale
*/

const { getPostBySearchQuery } = require('./../services/post')
const { getLikedPostsId } = require('./../services/likedPost')
const { getAllFavoritePostsWithIds } = require('./../services/favoritePost')
const { getAllRelations } = require('./../services/relation')
const { getAuthorizationBearerToken, isValidToken, getTokenPayload } = require('./../modules/authentication')
const Log = require('./../modules/logging')

/**
 * Displays posts according to the tag
 *
 * @param{Request} req the request object
 * @param{Response} res the response object
*/
async function postListTags(req, res) {
	const log = new Log(req)

	// Checking if all the required params are correct
	if ( !req.query.page || !req.query.page.trim() === '' ||
		!req.query.q || req.query.q.trim() === '') {
		res.sendStatus(400)
		log.error("The fields are not correct")
		return
	}

	let data = req.query
	const page = req.query.page

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

	// Gettings the user posts
	try {
		let postList = []

		// Getting the posts by query search
		const queryPosts = await getPostBySearchQuery(data, page) 

		// If the user is logged in
		if (data.id || data.id !== '') {
			let queryPostsIds = []
			let queryPostsUserIds = []

			// Getting the users and posts ids
			queryPosts.forEach( item => {
				queryPostsIds.push(item._id )
				queryPostsUserIds.push(item.user._id)
			})
			log.info('Got users and posts ids')

			// Getting user liked posts ids  by the logged in user 
			const userLikedPosts = await getLikedPostsId(data, queryPostsIds)
			let likedPostIds = userLikedPosts.map( item => item.post._id )
			log.info('Got user liked posts')

			// // Getting the user followings ids from the discover posts owners
			// const relations = await getAllRelations(data, queryPostsUserIds)
			// let follwingsIds = relations.map( item => item.following._id )
			// log.info('Got followed users')

			// // Getting the user favorite posts ids beetween the user posts
			// const favoritePosts = await getAllFavoritePostsWithIds(data, queryPostsIds)
			// let favoritePostsIds = favoritePosts.map( item => item.post._id )
			// log.info('Got user favorite posts')

			// Checking if the user post has been liked by the user
			queryPosts.forEach( (queryPost, index) => {
				let likedPost = false
				// let favorite = false
				// let following = false
				// Checking if the post has been liked by the user
				if ( likedPostIds.filter( likedPostId => likedPostId.toString() === queryPost._id.toString() ).length > 0 ) {
					likedPost = true
				}
				// // Checking if the post owner is followed by the user
				// if ( follwingsIds.filter( follwingsId => follwingsId.toString() === queryPost.user._id.toString() ).length > 0 ) {
				// 	following = true
				// }
				// // Chekcing if the post is one of the user favorite
				// if ( favoritePostsIds.filter( favoritePostsId => favoritePostsId.toString() === queryPost._id.toString() ).length > 0 ) {
				// 	favorite = true
				// }
				postList.push({
					user: {
					    _id: queryPost.user._id,
					    username: queryPost.user.username,
					    profileUrl: queryPost.user.profileUrl,
					    // isFollowedByUser: following
					},
					thumbnail: {
						desktop: {
							size: {
								width: queryPost.thumbnail.desktop.size.width,
								height: queryPost.thumbnail.desktop.size.width
							},
							url: queryPost.thumbnail.desktop.url
						},
						mobile: {
							size: {
								width: queryPost.thumbnail.mobile.size.width, //300
								height: queryPost.thumbnail.mobile.size.width
							},
							url: queryPost.thumbnail.mobile.url
						}
					},
					_id: queryPost._id,
					publicId: queryPost.publicId,
					likes: queryPost.likes,
					comments: queryPost.comments,
					time: queryPost.time,
					isLikedByUser: likedPost,
					// isUserFavorite: favorite
				})
					
			} )

		}else{
			// If the user is not logged in
			queryPosts.forEach( (queryPost, index) => {
				postList.push({
					user: {
					    _id: queryPost.user._id,
					    username: queryPost.user.username,
					    profileUrl: queryPost.user.profileUrl,
					    isFollowedByUser: false 
					},
					thumbnail: {
						desktop: {
							size: {
								width: queryPost.thumbnail.desktop.size.width,
								height: queryPost.thumbnail.desktop.size.width
							},
							url: queryPost.thumbnail.desktop.url
						},
						mobile: {
							size: {
								width: queryPost.thumbnail.mobile.size.width, //300
								height: queryPost.thumbnail.mobile.size.width
							},
							url: queryPost.thumbnail.mobile.url
						}
					},
					_id: queryPost._id,
					publicId: queryPost.publicId,
					likes: queryPost.likes,
					comments: queryPost.comments,
					time: queryPost.time,
					isLikedByUser: false,
					isUserFavorite: false
				})
					
			} )

		}

		log.info("Mapped user posts with liked post")

		res.json(postList)
		log.info("Got user posts")
	}catch(err) {
		res.sendStatus(500)
		log.error(err)
	}

}

module.exports = postListTags