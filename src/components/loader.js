import React from 'react';
import './../css/loader.css'

function LoaderSpin(props) {
	if (props.loading) {
		return (
			<div className="loader spin" 
					style={{ width: props.size, height: props.size}}>
			</div>
			)
	} else {
		return null
	}
}

export function PostLoaderSpin(props) {
	return (
		<div className="loader-container col-100" style={{height: props.size}}>
			{ props.loading && 
				<div className="loader spin" 
						style={{ width: props.size, height: props.size}}>
				</div>
			}
		</div> 
		)
}

export default LoaderSpin
