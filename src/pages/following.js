import React from 'react';

import { IconButton } from './../components/button';
import Header from './../components/header';
import UserCard from './../components/user-card';
import LoaderSpin from './../components/loader';

import { getFollowing } from './../services/relation'

import { setTitle } from './../modules/common'
import { _ } from './../modules/translate'

import './../css/relation.css';

import cancelButton from './../assets/icons/cancel.svg'

class Following extends React.Component {

  constructor(props) {
    super(props)

    this.abortController = new AbortController()
    this.loadFollowing = this.loadFollowing.bind(this)
    this.userCardContainer = React.createRef()
    this.loadFollowingOnScroll = this.loadFollowingOnScroll.bind(this)

    this.state = {
      page: 1,
      following: [],
      hasFollowing: true,
      isUserLoggedIn: false,
      loading: false
    }
  }

  componentDidMount() {

    this.loadFollowing()
    window.addEventListener('scroll', this.loadFollowingOnScroll)

    if ( localStorage.getItem('tk') ) this.setState({isUserLoggedIn:true})
  }

  componentWillUnmount() {
    this.abortController.abort()
    window.removeEventListener('scroll', this.loadFollowingOnScroll)
  }

  loadFollowingOnScroll() {

    let userCardContainer = this.userCardContainer.current
    let st = window.document.scrollingElement.scrollTop

    if ( this.state.loading ) return

    if (st >= userCardContainer.offsetTop + (userCardContainer.offsetHeight - 500) ) {
        if (this.state.hasFollowers) this.loadFollowing()
      }
  }

  loadFollowing( ) {
    const username = this.props.match.params.username

    setTitle(`Following (@${username})`)
    this.setState({loading: true})

    return getFollowing(`${username}/${this.state.page}`, this.abortController.signal)
    .then( result => {
      if (result.length < 1) {
        this.setState({loading: false, hasFollowers: false})
        return
      }
      const loggedInUser = JSON.parse(localStorage.getItem('data'))
      const following = result.filter( user => user.username !== loggedInUser.username )
      this.setState({loading: false})

      if ( result.length > 0 ) {
        this.setState( (state, props) => {
          return ({ 
            page: state.page + 1, 
            following: [...state.following, ...following]
          })
        })
      }

    } )
    .catch( status => { console.log(status) })
  }

  render() {
    let isModal = false
    // if (this.props.state) isModal = this.props.state.modal

    return (
      <div className={ isModal ? 'overlay modal col-100' : 'site-content col-100' }>
        { isModal ? <IconButton className="icon"
                                id='closeBtn'
                                type="button"
                                size="24px"
                                onClick={() => null}
                                src={ cancelButton } /> : 
          <Header /> }        
        <section className="following" ref={this.userCardContainer}>
          <div className='top'>
            <h2>{_("Abonnement")}</h2>
          </div>
          <div className='user-list col-100'>
            <ul>
              { this.state.following.map( user => {
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
        </section>
      </div>
    )
  }
}

export default Following;
