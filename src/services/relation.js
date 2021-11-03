/**
 * Relation service
 *
 * Author: samueladewale
*/
import { post, get } from './api'

const RELATION_FOLLOW_ENDPOINT = 'relation/follow'
const RELATION_FOLLOWERS_ENDPOINT = 'relation/followers'
const RELATION_FOLLOWING_ENDPOINT = 'relation/followings'

export function updateRelation(body, signal) {
	return new Promise( (resolve, reject) => {
		post(RELATION_FOLLOW_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}

export function getFollowers(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${RELATION_FOLLOWERS_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function getFollowing(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${RELATION_FOLLOWING_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}