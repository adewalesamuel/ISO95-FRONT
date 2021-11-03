/**
 * Image module 
 * Author: samueladewale
*/

export function loadImages(imgClassName='post-img', index=0) {
	window.setTimeout(() => {
		let images = window.document.getElementsByClassName(imgClassName)

		if (!images[index]) return
		if (!images[index].src.includes('uploads')) images[index].src = images[index].getAttribute('data-src')
	  if (images[index-1] && !images[index-1].src.includes('uploads')) {
	  	images[index-1].src = images[index-1].getAttribute('data-src')
	  }
	  if (images[index-2] && !images[index-2].src.includes('uploads')) {
	  	images[index-2].src = images[index-2].getAttribute('data-src')
	  }

		images[index].onload = () => loadImages(imgClassName, index + 1)
	}, 0)
}