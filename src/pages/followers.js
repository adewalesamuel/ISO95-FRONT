import React from 'react';

import { IconButton } from './../components/button';
import Header from './../components/header';
import UserCard from './../components/user-card';
import LoaderSpin from './../components/loader';

import { getFollowers } from './../services/relation'

import { setTitle } from './../modules/common'
import { _ } from './../modules/translate'

import './../css/relation.css';

import cancelButton from './../assets/icons/cancel.svg'

class Followers extends React.Component {

  constructor(props) {
    super(props)

    this.abortController = new AbortController()
    this.loadFollowers = this.loadFollowers.bind(this)
    this.userCardContainer = React.createRef()
    this.loadFollowersOnScroll = this.loadFollowersOnScroll.bind(this)

    this.state = {
      page: 1,
      followers: [],
      hasFollowers: true,
      isUserLoggedIn: false,
      loading: false
    }
  }

  componentDidMount() {

    this.loadFollowers()
    window.addEventListener('scroll', this.loadFollowersOnScroll)

    if ( localStorage.getItem('tk') ) this.setState({isUserLoggedIn:true})
  }

  componentWillUnmount() {
    this.abortController.abort()
    window.removeEventListener('scroll', this.loadFollowersOnScroll)
  }

  loadFollowersOnScroll() {

    let userCardContainer = this.userCardContainer.current
    let st = window.document.scrollingElement.scrollTop

    if ( this.state.loading ) return

    if (st >= userCardContainer.offsetTop + (userCardContainer.offsetHeight - 500) ) {
        if (this.state.hasFollowers) this.loadFollowers()
      }
  }

  loadFollowers( ) {
    const username = this.props.match.params.username

    setTitle(`Followers (@${username})`)
    this.setState({loading: true})

    return getFollowers(`${username}/${this.state.page}`, this.abortController.signal)
    .then( result => {

      if (result.length < 1) {
        this.setState({loading: false, hasFollowers: false})
        return
      }
      const loggedInUser = JSON.parse(localStorage.getItem('data'))
      const followers = result.filter( user => user.username !== loggedInUser.username )
      this.setState({loading: false})

      if ( result.length > 0 ) {
        this.setState( (state, props) => {
          return ({ 
            page: state.page + 1, 
            followers: [...state.followers, ...followers]
          })
        })
      }

    } )
    .catch( status => { console.log(status) })
  }

  render() {
    let isModal = false
    //if (this.props.location.state) isModal = this.props.location.state.modal
    return (
      <div className={ isModal ? 'overlay modal col-100' : 'site-content col-100' }>
        { isModal ? <IconButton className="icon"
                                id='closeBtn'
                                type="button"
                                size="24px"
                                onClick={() => null}
                                src={ cancelButton } /> : 
          <Header /> }
        <section className="followers" ref={this.userCardContainer}>
          <div className="content">
            <div className='top'>
              <h2>{_("Abonnés")}</h2>
            </div>
            <div className='user-list col-100'>
              <ul>
                { this.state.followers.map( user => {
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
              { this.state.loading &&  <LoaderSpin loading={ this.state.loading } size='30px'/> }
            </div>
          </div>
        </section>
      </div>
    )
  }
}

export default Followers;
