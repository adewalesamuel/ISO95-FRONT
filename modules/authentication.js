/**
 * Authentication module
 * Author: samuel adewale
*/
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { secretKey } = require('./../environement')

/**
 * Creates a hashed password
 * 
 * @param{String} password the password of the user
 * @return{Promise}
*/
const hashPassword = password => {
	return new Promise( (resolve, reject) => {
		const hash = crypto.createHash('sha256')
		hash.on('readable', () => {
			const data = hash.read()
			if (data) resolve(data.toString('hex'))
		})
		hash.write(password)
		hash.end()
	} )
}

/**
 * Creates a session token for the client
 * 
 * @param{Object} payload the payload containing the id and password of the user
 * @return{String}
*/
const getSessionToken = payload => {
	return jwt.sign(payload, secretKey, {expiresIn: new Date().getTime() + 1000 * 60 * 60 * 24 * 30 * 12})
}

/**
 * Checks if a token is valid
 * 
 * @param{String} token the token from the user session
 * @return{Boolean}
*/
const isValidToken = token => {
	try {
		jwt.verify(token, secretKey)
		return true
	}catch(err){
		return false
	}
}

/**
 * Gets the token payload form a session token
 * 
 * @param{String} token the token from the user session
 * @return{Object}
*/
const getTokenPayload = token => {
	return jwt.verify(token, secretKey)
}

/**
 * Creates à password renewal token
 * 
 * @param{String} payload some data of the user
 * @return{Object}
*/
const getPasswordRenewalToken = payload => {
	return jwt.sign(payload, secretKey, {expiresIn: new Date().getTime() + 1000 * 60 * 60 })
}

module.exports = {
	hashPassword,
	getSessionToken,
	isValidToken,
	getTokenPayload,
	getPasswordRenewalToken
}  

