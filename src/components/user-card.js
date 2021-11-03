import React from 'react';
import { Link } from "react-router-dom";

import { updateRelation } from './../services/relation'

import { PrimaryButtonSmall, SecondaryButtonSmall } from './../components/button'
import Avatar from './../components/avatar'

import './../css/user-card.css'

class UserCard extends React.Component {
  constructor(props) {
    super(props)

    this.followUser = this.followUser.bind(this)
    this.state = {
      isFollowedByUser: false
    }
  }

  componentDidMount() {
    this.setState({isFollowedByUser: this.props.user.isFollowedByUser})
  }

  followUser() {
    updateRelation({ id: this.props.user.id })
    .catch( status => {
      this.setState( (state, prop) => {
        return {isFollowedByUser: !state.isFollowedByUser}
      })
    })
    this.setState( (state, prop) => {
      return {isFollowedByUser: !state.isFollowedByUser}
    })
  }

  render(){
    return (
      <div className="user card">
        <Avatar src={ this.props.user.profileUrl }
                size="65px"
                alt={ this.props.user.username } />

        <div className="username col-100">
          <Link to={ '/user/' + this.props.user.username }> 
            <h6>{ this.props.user.username }</h6>
          </Link>
        </div>
        
        { !this.state.isFollowedByUser ?
          <PrimaryButtonSmall name='subscribe'
                        id='subscribe'
                        type='button'
                        onClick={this.followUser}>
            S'abonner
          </PrimaryButtonSmall> : 
          <SecondaryButtonSmall name='unsubscribe'
                        id='unsubscribe'
                        type='button'
                        onClick={this.followUser}>
            Abonné
          </SecondaryButtonSmall>
        }
        
      </div>
    )
  }
}

export default UserCard