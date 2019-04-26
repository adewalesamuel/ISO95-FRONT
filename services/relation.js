/**
 * Relation service
 * Author: samueladewale
*/
const { clientHost } = require('./../environement')
const mongoose = require('mongoose')
const Relation = require('./../models/Relation')

/**
 * Creates a relation
 *
 * @param{Object} userData the data of the follower
 * @param{Object} userToFollowData the data of the user to follow
 * @return{Promise}
*/
const createRelation = (userData, userToFollowData) => {
	const relation = new Relation({
		follower: {
		_id: userData.id,
		username: userData.username,
		profileUrl: userData.profileUrl
	},
	following: {
		_id: userToFollowData.id,
		username: userToFollowData.username,
		profileUrl: userToFollowData.profileUrl
	}
	} )

	return relation.save()
}

/**
 * Delete a relation
 *
 * @param{Object} userData the data of the follower
 * @param{Object} userToUnfollowData the data of the user to unfollow 
 * @return{Promise}
*/
const deleteRelation = (userData, userToUnfollowData) => {
	return Relation.remove({
		'follower._id': userData.id,
		'following._id': userToUnfollowData.id
	} )

	return relation.save()
}

/**
 * Gets a relation
 *
 * @param{Object} userData the data of the follower
 * @param{Object} followedUserData the data of the followed user
 * @return{Promise}
*/
const getRelation = (userData, followedUserData) => {
	return Relation.findOne({
		'follower._id': userData.id,
		'following._id': followedUserData.id
	} )
}

/**
 * Gets a users followers
 *
 * @param{Object} data the data of the user
 * @return{Promise}
*/
const getAllFollowers = (data, skip=0, limit=10) => {
	return Relation.find({
		'following.username': data.username
	}, { follower: 1 } )
	.skip( skip > 0 ? ( (skip - 1) * limit) : 0 )
	.limit(limit)
}

/**
 * Gets a users following
 *
 * @param{Object} data the data of the users
 * @return{Promise}
*/
const getAllFollowings = (data, skip=0, limit=10) => {
	return Relation.find({
		'follower.username': data.username
	}, { following: 1 } )
	.skip( skip > 0 ? ( (skip - 1) * limit) : 0 )
	.limit(limit)
}

/**
 * Gets a users followings by its id
 *
 * @param{Object} data the data of the users
 * @return{Promise}
*/
const getAllFollowingsById = (data) => {
	return Relation.find({
		'follower._id': data.id
	}, { 'following._id': 1 } )
}

module.exports = {
	createRelation,
	getRelation,
	getAllFollowers,
	getAllFollowings,
	deleteRelation,
	getAllFollowingsById
}
