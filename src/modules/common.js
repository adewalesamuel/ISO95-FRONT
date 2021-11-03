/**
 * Common module
 * Author: samueladewale
*/

export const PADDING_ADJUST = 7.4

export function parseQueryString(queryString) {
	let parsed = {}
	if ( queryString[0] !== '?' ) return
	let q = queryString.substring(1, queryString.length )

	if (q.indexOf('&') === -1) {
		parsed[q.split('=')[0]] = q.split('=')[1] 
	}else {
		q.split("&").forEach( item => {
			parsed[item.split('=')[0]] = item.split('=')[1]
		})
	}

	return parsed
}

export function isMobile() {
	if (window.navigator.userAgent.search(/mobile/i) > -1 && 
		  window.screen.width <= 550) {
		return true
	}else {
		return false
	}
}

export function setTitle(string) {
	window.document.title = string.toString() + ' | ISO95.'
}