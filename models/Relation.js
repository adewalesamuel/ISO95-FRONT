/**
 * Relation model
 * Author: samueladewale
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Relation = mongoose.model('Relation', new Schema({
	user: {
		_id: mongoose.Schema.Types.ObjectId
	},
	follower: {
		_id: mongoose.Schema.Types.ObjectId,
		username: String,
		profileUrl: String
	}
}))

module.exports = Relation