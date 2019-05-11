import React from 'react';
import './../css/button.css'
import LoaderSpin from './loader'

function PrimaryButtonBig(props) {
	return (
		<button name={ props.name }
						className="primary big"
						id={ props.id }
						type={ props.type }
						disabled={ props.loading ? true : false}
						onClick={props.onClick && props.onClick}>
			{ props.loading ? <LoaderSpin size='15px'/> : props.children }
		</button>
		)
}

export function SecondaryButtonBig(props) {
	return (
		<button name={ props.name }
						className="secondary big"
						id={ props.id }
						type={ props.type }
						disabled={ props.loading ? true : false}
						onClick={props.onClick && props.onClick}>
			{ props.children }
		</button>
		)
}

export function TextButton(props) {
	return (
		<button className="text"
						style={{ fontSize: props.fontSize }}
						type="button"
						onClick={props.onClick && props.onClick}>
			{ props.children }
		</button>
		)
}

export default PrimaryButtonBig;
