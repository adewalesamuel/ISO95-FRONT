import React from 'react';
import './../css/error.css'

function ErrorMessage(props) {
	return (
		<div className="error">
			{ props.message && props.message}
		</div>
		)
}

export default ErrorMessage