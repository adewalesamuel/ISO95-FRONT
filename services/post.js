/**
 * User service
 * Author: samueladewale
*/
const { clientHost } = require('./../environement')
const mongoose = require('mongoose')
const Post = require('./../models/Post')

/**
 * Creates a post with a picture
 *
 * @param{Object} data the data of the new user
 * @param{Object} photo the pictures informations
 * @return{Promise}
*/
const createPostWithPhoto = (data, photo) => {
	const post = new Post({
		publicId: data.publicId,
		user: {
			_id: data.id,
			username: data.username,
			profileUrl: data.profileUrl
		},
		thumbnail: { // For explore, user post, search
			desktop: {
				size: {
					width: photo.thumbnail.desktop.size.width, // 554
					height: photo.thumbnail.desktop.size.height // 610 305
				},
				url: `${clientHost}/${photo.thumbnail.desktop.url}`
			},
			mobile: {
				size: {
					width: photo.thumbnail.mobile.size.width, // 406
					height: photo.thumbnail.mobile.size.height // 447 223
				},
				url: `${clientHost}/${photo.thumbnail.mobile.url}`
			}
		},
		photo: {
			alt: '',
			desktop: {
				quality: {
					medium: { // For feed
						size: {
							width: photo.desktop.quality.medium.size.width, //900
							height: photo.desktop.quality.medium.size.height
						},
						url: `${clientHost}/${photo.desktop.quality.medium.url}`
					},
					high: { // For post
						size: {
							width: photo.desktop.quality.high.size.width, //1900
							height: photo.desktop.quality.high.size.height
						},
						url: `${clientHost}/${photo.desktop.quality.high.url}`
					}
				}
			},
			mobile: {
				size: {
					width: photo.mobile.size.width, //554
					height: photo.mobile.size.height
				},
				url: `${clientHost}/${photo.mobile.url}`
			}
		},
		time: new Date().getTime(),
		likes: 0,
		comments: 0,
		views: 0,
		caption: "",
		place: {
			city: "",
			country: ""
		},
		camera: {
			name: "",
			shutterSpeed: "",
			focalLength: "",
			iso: "",
			aperture: ""
		},
		tags: []
	} )

	return post.save()
}

/**
 * Update a post informations
 *
 * @param{Object} data the data of the new user
 * @return{Promise}
*/
const updatePostInfo = (data) => {
	return Post.updateOne({
		publicId: data.publicId, 
		'user._id': data.id
	},{
		$set: {
			'photo.alt': data.photoAlt,
			caption: data.caption,
			place: {
				city: data.place.city,
				country: data.place.country
			},
			camera: {
				name: data.camera.name,
				shutterSpeed: data.camera.shutterSpeed,
				focalLength: data.camera.focalLength,
				iso: data.camera.iso,
				aperture: data.camera.aperture
			},
			tags: [...data.tags]
		}
	} )
}

/**
 * Gets a post
 *
 * @param{Object} data the data of the user
 * @return{Promise}
*/
const getPostById = (data) => {
	return 	Post.findOne( { 
		publicId: data.publicId
	 }, { _id: 0, thumbnail: 0} )
}

/**
 * Gets all a users posts
 *
 * @param{Object} data the data of the user
 * @return{Promise}
*/
const getUserPosts = (data) => {
	return Post.find( { 
		'user.username': data.username
	 } )
}

/**
 * Delete a users post and returns it
 *
 * @param{Object} data the data of the user
 * @param{Object} publicId the public id of the post
 * @return{Promise}
*/
const findAndDeleteUserPost = (data, publicId) => {
	return 	Post.findOneAndDelete( { 
		'user._id': data.id,
		publicId: publicId
	 } )
}

/**
 * Gets the specified users posts
 *
 * @param{Array} users the users ids
 * @return{Promise}
*/
const getUsersPosts = (users, skip=0, limit=6) => {
	return 	Post.find( { 
		'user._id': { $in: [...users] }
	 },{ 
	 	thumbnail: 0,
	 	place: 0,
	 	camera: 0,
	 	tags: 0,
	 	caption: 0,
	 	'photo.desktop.quality.high': 0
	 } )
	.sort({ 'time': 1 })
	.skip( skip > 0 ? ( (skip - 1) * limit) : 0 )
	.limit(limit)
}

module.exports = {
	createPostWithPhoto,
	getPostById,
	findAndDeleteUserPost,
	updatePostInfo,
	getUserPosts,
	getUsersPosts
}
