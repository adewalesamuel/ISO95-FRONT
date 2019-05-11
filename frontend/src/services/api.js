/**
 * Api service
 *
 * Author: samueladewale
*/
const PORT = 3000
const HOST = 'http://192.168.1.3'
const API_URL = `${HOST}:${PORT}`
const HEADERS = {
	'Accept': 'application/json, text/plain',
	'Connection': 'Keep-Alive',
	'Content-type': 'application/json',
	'Authorization': localStorage.getItem('tk') && localStorage.getItem('tk')
}

export function get(endpoint) {
	return fetch(`${API_URL}/endpoint`,{
		method: 'GET',
		headers: HEADERS
	})
}

export function post(endpoint, body) {
	return fetch(`${API_URL}/${endpoint}`,{
		method: 'POST',
		headers: HEADERS,
		body: JSON.stringify(body)
	})
}
