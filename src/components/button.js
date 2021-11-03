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
			{ props.loading ? <LoaderSpin loading={props.loading} 
																		size='15px'/> : props.children }
		</button>
		)
}

export function PrimaryButtonSmall(props) {
	return (
		<button name={ props.name }
						className="primary small"
						id={ props.id }
						type={ props.type }
						disabled={ props.loading ? true : false}
						onClick={props.onClick && props.onClick}>
			{ props.loading ? <LoaderSpin loading={props.loading} 
																		size='15px'/> : props.children }
		</button>
		)
}

export function SecondaryButtonSmall(props) {
	return (
		<button name={ props.name }
						className="secondary small"
						id={ props.id }
						type={ props.type }
						disabled={ props.loading ? true : false}
						onClick={props.onClick && props.onClick}>
			{ props.loading ? <LoaderSpin loading={props.loading} 
																		size='15px'/> : props.children }
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
			{ props.loading ? <LoaderSpin loading={props.loading} 
																		size='15px'/> : props.children }
		</button>
		)
}

export function TextButton(props) {
	return (
		<button className="text primary"
						style={{ fontSize: props.fontSize ? props.fontSize : '1rem' }}
						type="button"
						onClick={props.onClick && props.onClick}>
			{ props.children }
		</button>
		)
}

export function TextButtonSecondary(props) {
	return (
		<button className="text secondary"
						style={{ fontSize: props.fontSize ? props.fontSize : '0.88rem' }}
						type="button"
						onClick={props.onClick && props.onClick}>
			{ props.children }
		</button>
		)
}

export function IconButton(props) {
	return (
		<button className="icon"
						id={props.id && props.id}
						type="button"
						onClick={props.onClick && props.onClick}>
			<img alt='' 
					src={props.src} 
					width={ props.size ? props.size : '28px' } />
		</button>
		)
}

export default PrimaryButtonBig;
