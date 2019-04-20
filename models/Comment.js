/**
 * Comment model
 * Author: samueladewale
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Comment = mongoose.model('Comment', new Schema({
	post: {
		_id: mongoose.Schema.Types.ObjectId,
	},
	user: {
		_id: mongoose.Schema.Types.ObjectId,
		username: String,
		profileUrl: String
	},
	comment: String,
	time: Number,
	likes: Number,
	responses: [
		{
			_id: mongoose.Schema.Types.ObjectId,
			user: {
				_id: mongoose.Schema.Types.ObjectId,
				username: String,
				profileUrl: String
			},
			comment: String,
			time: Number,
			likes: Number
		}
	]
}))

module.exports = Comment