/**
 * Post service
 *
 * Author: samueladewale
*/
import { post, get } from './api'

const COMMENT_ENDPOINT = 'comment'

export function createComment(body, signal) {
	return new Promise( (resolve, reject) => {
		post(COMMENT_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}

export function getPostComments(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${COMMENT_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}
