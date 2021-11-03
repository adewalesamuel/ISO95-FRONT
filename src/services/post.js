/**
 * Post service
 *
 * Author: samueladewale
*/
import { post, get, erase } from './api'

const POST_ENDPOINT = 'post'
const USER_PHOTO_ENDPOINT = 'post/user'
const SET_PHOTO_ALT_ENDPOINT = 'post/alt'
const PHOTO_INFO_ENDPOINT = 'post/info'
const PHOTO_LIKE_ENDPOINT = 'post/like'
const USER_FAVORITE_ENDPOINT = 'post/favorite'
const POST_TAG_ENDPOINT = 'post/tag'
const POST_DISCOVER_ENDPOINT = 'post/discover'
const POST_FEED_ENDPOINT = 'post/feed'
const POST_BEST_ENDPOINT = 'post/best'
const POST_VIEW_ENDPOINT = 'post/view'
const POST_SEARCH_ENDPOINT = 'post/search'

export function setFavorite(body, signal) {
	return new Promise( (resolve, reject) => {
		post(USER_FAVORITE_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}

export function createPostView(body, signal) {
	return new Promise( (resolve, reject) => {
		post(POST_VIEW_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}

export function getFeedPhotos(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${POST_FEED_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function getBestWeekPhotos(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${POST_BEST_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function searchPhotos(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${POST_SEARCH_ENDPOINT}${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function getPhotosByTags(params, body, signal) {
	return new Promise( (resolve, reject) => {
		post(`${POST_TAG_ENDPOINT}/${params}`, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function getPhoto(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${POST_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function getUserPhotos(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${USER_PHOTO_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function getUserFavorites(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${USER_FAVORITE_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function getDisoverPhotos(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${POST_DISCOVER_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function setPhotoAlt(body, signal) {
	return new Promise( (resolve, reject) => {
		post(SET_PHOTO_ALT_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}

export function setPhotoInfo(body, signal) {
	return new Promise( (resolve, reject) => {
		post(PHOTO_INFO_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}


export function updatePhotoLike(body, signal) {
	return new Promise( (resolve, reject) => {
		post(PHOTO_LIKE_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}


export function deletePhoto(body, signal) {
	return new Promise( (resolve, reject) => {
		erase(POST_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}