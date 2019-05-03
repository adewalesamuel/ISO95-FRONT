/**
 * Comment service
 * Author: samueladewale
*/
const mongoose = require('mongoose')
const Comment = require('./../models/Comment')

const createComment = (data, user) => {
	const comment = new Comment({
 		post: {
 			_id: data.postId,
 		},
 		user: {
 			_id: user._id,
 			username: user.username,
 			profileUrl: user.profileUrl
 		},
 		comment: data.comment,
 		time: new Date().getTime(),
	 })

 return comment.save()
}

const getPostComments = (data, skip=0, limit=6) => {
	return Comment.find({
		'post._id': data.postId
	})
	.sort({ time: -1 })
	.skip( skip > 0 ? ( (skip - 1) * limit) : 0 )
	.limit(limit)
}

const updateCommentUserProfileUrl = data => {
	const profileUrl = `/uploads/profiles/${data.filename}`
	return Comment.updateMany(
		{ 'user._id': data.id }, 
		{ $set: {
			'user.profileUrl': profileUrl } })
}

const deleteComment = data => {
	return Comment.findOneAndDelete({ 
		'post._id': data.postId,
		_id: data.commentId
	})
}

module.exports = {
	createComment,
	getPostComments,
	updateCommentUserProfileUrl,
	deleteComment
}