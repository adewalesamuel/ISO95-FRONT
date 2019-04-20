/**
 * User service
 * Author: samueladewale
*/
const { clientHost } = require('./../environement')
const mongoose = require('mongoose')
const User = require('./../models/User')

/**
 * Creates a user
 *
 * @param{Object} data the data of the new user
 * @return{Promise}
*/
const createUser = (data) => {
	const user = new User({
		fullname: data.fullname ? data.fullname : '',
		username: data.username,
		password: data.password,
		profileUrl: `${clientHost}/uploads/profile/${new Date().getTime() * Math.round((Math.random() * 1000))}`,
		relations: {
			followers: 0,
			following: 0,
		},
		description: '',
		email: data.email,
		tel: '',
		website: '',
		place: {
			city: '',
			country: '',
		},
		grades: [],
		posts: 0,
		favorites: 0,
		new: true
	} )

	return user.save()
}

/**
 * Gets a user
 *
 * @param{Object} data some data of the user to get
 * @return{Promise}
*/
const getUser = (data) => {
	return User.findOne({
		$or: [
			{ username: data.username },
			{ email: data.email }
		]})
}

/**
 * Gets a user
 *
 * @param{Object} data some data of the user to get
 * @return{Promise}
*/
const getUserWithPassword = (data) => {
	return User.findOne({
		$or: [
			{ username: data.username },
			{ email: data.username }
		],
		password: data.password
	})
}

/**
 * Gets a user
 *
 * @param{Object} data some data of the user to get
 * @return{Promise}
*/
const getUserWithEmail = (data) => {
	return User.findOne({ email: data.email })
}

module.exports = {
	createUser,
	getUser,
	getUserWithPassword,
	getUserWithEmail
}
