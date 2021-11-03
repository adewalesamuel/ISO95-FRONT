import React from 'react';
import { Link } from "react-router-dom";

import Avatar from './../components/avatar'
import { IconButton } from './../components/button'

import { API_URL } from './../services/api';
import { setFavorite, updatePhotoLike } from './../services/post';

import { _ } from './../modules/translate'

import whiteLikeIcon from './../assets/icons/like-white.svg'
import activeWhiteLikeIcon from './../assets/icons/like-white-active.svg'
import whiteCommentIcon from './../assets/icons/comment-white.svg'
import likeIcon from './../assets/icons/like.svg';
import activeLikeIcon from './../assets/icons/like-active.svg';
import commentIcon from './../assets/icons/comment.svg';
import starIcon from './../assets/icons/star.svg';
import activeStarIcon from './../assets/icons/star-active.svg';
import shareIcon from './../assets/icons/share.svg';

import './../css/post-card.css'

class PostCard extends React.Component {
  constructor(props) {
    super(props)

    this.likePost = this.likePost.bind(this)
    this.savePhoto = this.savePhoto.bind(this)

    this.state = {
      isLikedByUser: false,
      isUserFavorite: false,
      isFollowedByUser: false,
      likes: ''
    }

  }

  componentDidMount() {
    this.setState({
      isLikedByUser: this.props.post.isLikedByUser,
      isFollowedByUser: this.props.post.user.isFollowedByUser,
      isUserFavorite: this.props.post.isUserFavorite,
      likes: this.props.post.likes
    })
  }

  likePost() {
    updatePhotoLike({postId: this.props.post.id}).catch( status => console.log(status))
    this.setState( (state, props) => {
      return {
        isLikedByUser: !state.isLikedByUser,
        likes: state.isLikedByUser ? state.likes - 1 : state.likes + 1
      }
    })
  }

  savePhoto() {
    setFavorite({postId: this.props.post.id}).catch( status => console.log(status))
    this.setState( (state, prop) => {
      return { isUserFavorite: !state.isUserFavorite}
    })
  }

  render(){
    return (
      <div className="post-card">
        <div className="top"> 
          <div className="user">
            <Link to={ '/user/' + this.props.post.user.username }> 
              <Avatar src={ this.props.post.user.profileUrl }
                      size='45px'
                      alt={ this.props.post.user.username } />
              <h6>{ this.props.post.user.username }</h6>
            </Link>
          </div>
        </div>

        <div className="photo" 
            style={{paddingBottom: this.props.post.padding + '%', "--natural-padding": this.props.post.naturalPadding + '%'}}>
          <img className='post-img'
              src='' 
              alt={ this.props.post.photo ? this.props.post.photo.alt : ''}
              data-src={API_URL + this.props.post.photoUrl}
              data-photo-mobile-url={this.props.post.photo.mobile && this.props.post.photo.mobile.url} />

          <div className="overlay"></div>
          <Link to={'/post/' + this.props.post.publicId}></Link>
        </div>

        <div className="button-group">
          <div className="primary">
            <span className="likes">
              <IconButton id="likeBtn" size='34px' 
                          onClick={this.likePost} 
                          src={ this.state.isLikedByUser ? activeWhiteLikeIcon : whiteLikeIcon} />
              <span className="counts">{this.state.likes}</span>           
            </span>
            <span className="comments">
              <Link to={'/post/' + this.props.post.publicId}>
                <IconButton id="commentBtn" size='34px' src={whiteCommentIcon} />
              </Link>
              <span className="counts">{this.props.post.comments}</span>
            </span>
          </div>
        </div>

        <div className="body">
          <div className="buttons">
            <div className="primary">
              <IconButton id="likeBtn" 
                          size='40px' 
                          src={ this.state.isLikedByUser ? activeLikeIcon : likeIcon} 
                          onClick={this.likePost}/>

              <Link to={'post/' + this.props.post.publicId }>
               <IconButton id="commentBtn" 
                            size='40px' 
                            src={commentIcon} />
              </Link>

              <IconButton id="favoriteBtn" 
                          size='40px' 
                          src={ this.state.isUserFavorite ? activeStarIcon : starIcon} 
                          onClick={this.savePhoto}/>
            </div>
            <div className="share">
            <a className="col-100"
              rel="noopener noreferrer"
              href={"http://www.facebook.com/sharer.php?u=" + window.location.href} 
              target="_blank">  
                <IconButton id="shareBtn" 
                            size='40px' 
                            src={ shareIcon } />
              </a>
            </div>
          </div>
          <div className="likes">
            <Link to={'post/' + this.props.post.publicId + '/likes'}>
              <h3>{this.state.likes} {_("j'aimes")}</h3>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default PostCard