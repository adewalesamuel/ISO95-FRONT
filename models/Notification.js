/**
 * Notification model
 * Author: samueladewale
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Notification = mongoose.model('Notification', new Schema({
		type: String,
		sender: {
			_id: mongoose.Schema.Types.ObjectId,
			username: String,
			profilePic: String
		},
		user: {
			_id: mongoose.Schema.Types.ObjectId,
		},
		thumbnail: String,
		body: String,
		time: Number,
		url: String,
		isViewed: Boolean
}))

module.exports = Notification