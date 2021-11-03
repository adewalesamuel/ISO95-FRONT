import React from 'react';
import { Link } from "react-router-dom";

import { IconButton } from './../components/button'
import Avatar from './../components/avatar'

import { logout } from './../modules/authentication'
import { _ } from './../modules/translate'

import exploreIcon from './../assets/icons/explore.svg'
import pictureIcon from './../assets/icons/picture.svg'
import messageIcon from './../assets/icons/message.svg'
import notificationIcon from './../assets/icons/notification.svg'

function NavIcons(props) {
  return (
    <nav className='navicons'>
      <ul className="nav-list">
        <li className="nav-item">
          <Link to='/explore'><IconButton src={exploreIcon} size="28px"/></Link>
        </li>
        <li className="nav-item">
          <Link to='/best'><IconButton src={pictureIcon} size='30px'/></Link>
        </li>
        <li className="nav-item">
          <IconButton id='notificationBtn' src={notificationIcon} size='28px'/>
        </li>
        <li className="nav-item">
          <IconButton id='messageBtn' src={messageIcon} size='31px'/>
        </li>
        <li className="nav-item profile">
          <button type="button" 
                  className="icon"
                  onClick={props.onAvatarClick}>
            <Avatar src={ props.user.profileUrl }
                    size={ '38px'}
                    alt="Profile picture" />
          </button>
          { props.user.hasDropDown &&
            <div className="dropdown">
              <ul>  
                <Link to='/new-post'>
                  <li className="new-post col-100">
                      {_("Poster une photo")}
                  </li>
                </Link>
                <Link to={'/user/' + props.user.username }>
                  <li>
                      {_("Mon profil")}
                  </li>
                </Link>
                <button type="button"
                        id="logoutBtn"
                        onClick={() => logout()}>
                  <li>
                      {_("Se déconnecter")}
                  </li>
                </button>
              </ul>
            </div>
           }
        </li>
      </ul>
    </nav>
  )
}

export default NavIcons;
