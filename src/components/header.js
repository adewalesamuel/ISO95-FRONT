import React from 'react';
import { Link } from 'react-router-dom';
import PrimaryButton, { TextButton } from './../components/button'
import Logo from './../components/logo'
import SearchBar from './../components/search-bar'
import NavIcons from './../components/navicons'

import { _ } from './../modules/translate'

import './../css/header.css'

class Header extends React.Component {
  constructor(props) {
    super(props)

    this.toggleDropDown = this.toggleDropDown.bind(this)
    this.state = {
      isUserLoggedIn: false,
      profileUrl: '',
      hasDropDown: false,
      username: ''
    }
  }

  componentDidMount() {
    if (localStorage.getItem('data')) {
      this.setState({isUserLoggedIn: true})
      const userData = JSON.parse(localStorage.getItem('data'))
      this.setState({
        profileUrl: userData.profileUrl,
        username: userData.username
      })
    }
  }

  toggleDropDown() {
    this.setState( (state, props) => { return { hasDropDown: !state.hasDropDown } } )
  }

  render() {
    return (
      <header className="site-header col-100">
        <div className="content">
          <Logo />
          <SearchBar />
          { this.state.isUserLoggedIn ?
            <NavIcons user={this.state} 
                      onAvatarClick={this.toggleDropDown}/> :
            <div className="buttons-container">
              <Link to='/login'>
                <TextButton name='loginBtn-link'
                              id='loginBtn-link'
                              type='button'>
                  {_("Connexion")}
                </TextButton>
              </Link>
              <Link to='/register' style={{marginLeft: '20px'}}>
                <PrimaryButton name='registerBtn-link'
                              id='registerBtn-link'
                              type='button'>
                  {_("S'inscrire")}
                </PrimaryButton>
              </Link>
            </div>
            }
        </div>
      </header>
    )
  }
}

export default Header;
