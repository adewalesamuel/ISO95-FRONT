import React from 'react';
import './../css/text.css'

export function TextePrimary(props) {
	return (
		<p className="text primary" 
			style={{ fontSize: props.fontSize ? props.fontSize : '1rem'}}>
			{ props.children }
		</p>
		)
}

export function TextSecondary(props) {
	return (
		<p className="text secondary" 
			style={{ fontSize: props.fontSize ? props.fontSize : '1rem'}}>
			{ props.children }
		</p>
		)
}