/**
 * User service
 *
 * Author: samueladewale
*/
import { post, put, get } from './api'

const USER_REGISTER_ENDPOINT = 'user/register'
const USER_LOGIN_ENDPOINT = 'user/login'
const PASSWORD_TOKEN_ENDPOINT = 'user/forgot-password'
const NEW_PASSWORD_ENDPOINT = 'user/new-password'
const POPULAR_USERS_ENDPOINT = 'user/popular'
const USER_ENDPOINT = 'user/profile'


export function getPopularUsers(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${POPULAR_USERS_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function getUser(params, signal) {
	return new Promise( (resolve, reject) => {
		get(`${USER_ENDPOINT}/${params}`, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function createUser(body, signal) {
	return new Promise( (resolve, reject) => {
		post(USER_REGISTER_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function loginUser(body, signal) {
	return new Promise( (resolve, reject) => {
		post(USER_LOGIN_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.json())
		} )
		.catch( err => reject(err))
	} )
}

export function sendPasswordToken(body, signal) {
	return new Promise( (resolve, reject) => {
		post(PASSWORD_TOKEN_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}

export function updatePassword(body, signal) {
	return new Promise( (resolve, reject) => {
		put(NEW_PASSWORD_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}

export function updateUser(body, signal) {
	return new Promise( (resolve, reject) => {
		put(USER_ENDPOINT, body, signal)
		.then( response => {
			if (!response.ok) return reject(response.status) 
			resolve(response.text())
		} )
		.catch( err => reject(err))
	} )
}