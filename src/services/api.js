/**
 * Api service
 *
 * Author: samueladewale
*/
const PORT = 8080
const HOST = 'http://127.0.0.1' //'http://195.110.35.97' //'http://192.168.1.5'
export const API_URL = process.env.REACT_APP_API_URL ?? `${HOST}:${PORT}`
const abortController = new AbortController()
const HEADERS = {
	'Accept': 'application/json, text/plain',
	'Connection': 'Keep-Alive',
	'Content-type': 'application/json',
	'Authorization': localStorage.getItem('tk') && 'Bearer ' + localStorage.getItem('tk')
}

export function get(endpoint, signal=abortController.signal) {
	return fetch(`${API_URL}/api/${endpoint}`,{
		method: 'GET',
		signal: signal,
		headers: {
			'Accept': 'application/json, text/plain',
			'Connection': 'Keep-Alive',
			'Content-type': 'application/json',
			'Authorization': localStorage.getItem('tk') && 'Bearer ' + localStorage.getItem('tk')
		}
	})
}

export function post(endpoint, body, signal=abortController.signal) {
	return fetch(`${API_URL}/api/${endpoint}`,{
		method: 'POST',
		signal: signal,
		headers: HEADERS,
		body: JSON.stringify(body)
	})
}

export function put(endpoint, body, signal=abortController.signal) {
	return fetch(`${API_URL}/api/${endpoint}`,{
		method: 'PUT',
		signal: signal,
		headers: HEADERS,
		body: JSON.stringify(body)
	})
}

export function erase(endpoint, body, signal=abortController.signal) {
	return fetch(`${API_URL}/api/${endpoint}`,{
		method: 'DELETE',
		signal: signal,
		headers: HEADERS,
		body: JSON.stringify(body)
	})
}