import React from 'react';
import { Link } from "react-router-dom";

import PrimaryButtonBig, { TextButton } from './../components/button';
import Header from './../components/header';
import UserCard from './../components/user-card';
import LoaderSpin from './../components/loader';

import { getPopularUsers } from './../services/user'

import { setTitle } from './../modules/common'
import { _ } from './../modules/translate'

import './../css/popular-users.css';

class PopularUsers extends React.Component {
  constructor(props) {
    super(props)

    this.loadPopularUsers = this.loadPopularUsers.bind(this)

    this.state = {
      page: 1,
      popularUsers: [],
      username: null,
      isUserLoggedIn: false,
      loading: false
    }
  }

  componentDidMount() {
    setTitle("Popular Users")
    
    if ( localStorage.getItem('data') ) {
      this.setState({username: JSON.parse(localStorage.getItem('data')).username})
    }
    this.loadPopularUsers()
  }

  loadPopularUsers(e) {
    if (e) e.preventDefault()

    this.setState({loading: true})

    getPopularUsers(this.state.page)
    .then( result => {
      let popularUsers = result.filter( user => user.username !== this.state.username )
      this.setState({loading: false})

      if ( result.length > 0 ) {
        this.setState( (state, props) => {
          return ({ 
            loading:false, 
            page: state.page + 1, 
            popularUsers
          })
        })
      }

    } )
    .catch( status => { this.setState({loading: false}) })
  }

  render() {
    const nextLink = this.state.username ? '/user/' + this.state.username  : '/register'
    return (
      <div className="site-content col-100">
        <Header />
        <section className="popular-users">
          <div className='top'>
            <h2>{_("Photograhes populaires")}</h2>
            <TextButton onClick={ this.loadPopularUsers }>{_("voir plus")}</TextButton>
          </div>
          <div className='user-list col-100'>
            <ul>
              { this.state.loading ?  <LoaderSpin loading={ this.state.loading } size='30px'/> :
              this.state.popularUsers.map( (user, index) => {
                return(
                  <li className='col-fourth' 
                      key={user.id}
                      id={user.id}>
                    <UserCard user={user} />
                  </li>
                  )
              } ) 
             }
            </ul>
          </div>
          <div className='bottom'>
            <Link to={nextLink}>
              <PrimaryButtonBig name='nextBtn'
                                id='nextBtn'
                                type='button'>
                {_("Suivant")}
              </PrimaryButtonBig>
            </Link>
          </div>
        </section>
      </div>
    )
  }
}

export default PopularUsers;
