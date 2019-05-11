/**
 * User service
 *
 * Author: samueladewale
*/
import { get, post } from './api'

const USER_REGISTER_ENDPOINT = 'user/register'
const USER_LOGIN_ENDPOINT = 'user/login'


export function createUser(body) {
	return new Promise( (resolve, reject) => {
		post(USER_REGISTER_ENDPOINT, body)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function loginUser(body) {
	return new Promise( (resolve, reject) => {
		post(USER_LOGIN_ENDPOINT, body)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}