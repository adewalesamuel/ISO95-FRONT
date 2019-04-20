/**
 * Post model
 * Author: samueladewale
*/
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Post = mongoose.model('Post', new Schema({
	user: {
		_id: mongoose.Schema.Types.ObjectId,
		username:String,
		profileUrl: String
	},
	thumbnail: { // For explore, user post, search
		desktop: {
			size: {
				width: Number,
				height: Number
			},
			url: String
		},
		mobile: {
			size: {
				width: Number,
				height: Number
			},
			url: String
		}
	},
	photo: {
		alt: String,
		desktop: {
			quality: {
				medium: { // For feed
					size: {
						width: Number,
						height: Number
					},
					url: String
				},
				high: { // For post
					size: {
						width: Number,
						height: Number
					},
					url: String
				}
			}
		},
		mobile: {
			size: {
				width: Number,
				height: Number
			},
			url: String
		}
	},
	likes: Number,
	comments: Number,
	views: Number,
	caption: String,
	place: {
		city: String,
		country: String
	},
	camera: {
		name: String,
		shutterSpeed: String,
		focalLength: Number,
		iso: Number,
		aperture: String
	},
	tags: [String]
}))

module.exports = Post