import React from 'react';

import { API_URL } from './../services/api';

import  './../css/avatar.css';

import AvatarPlaceholder from './../assets/images/avatar-placeholder.png';

function Avatar(props) {
	let src

  if (props.src && props.src !== '') {
    if (props.src.includes('blob')) {
      src = props.src
    }else {
      src = API_URL + props.src
    }
  }

  return (
    <figure className="avatar" style={{width: props.size, height: props.size}}>
      <img src={ props.src !== '' ? src : AvatarPlaceholder }
            alt={props.alt} />    
    </figure>
  )
}

export default Avatar