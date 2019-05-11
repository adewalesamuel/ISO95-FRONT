import React from 'react';
import './../css/loader.css'

function LoaderSpin(props) {
	return (
		<div className="loader spin" 
				style={{ width:props.size, height: props.size}}>
		</div>
		)
}

export default LoaderSpin