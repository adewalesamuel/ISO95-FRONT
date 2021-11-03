/**
 * Authentication module
 * Author: samuel adewale
*/

export function logout() {
	localStorage.clear()
	window.location.href = '/login'
}