import React from 'react';
import { Link } from "react-router-dom";

import { PrimaryButtonSmall, SecondaryButtonSmall, TextButtonSecondary } from './../components/button';
import { TextSecondary, TextePrimary } from './../components/text';
import Header from './../components/header';
import LoaderSpin from './../components/loader';
import Avatar from './../components/avatar';
import Form from './../components/form';
import { TextArea } from './../components/input';
import PostList from './../components/post-list';
import { IconButton } from './../components/button';

import { API_URL } from './../services/api';
import { updateRelation } from './../services/relation';
import { getPhoto, setFavorite, getPhotosByTags, updatePhotoLike, deletePhoto, createPostView } from './../services/post';
import { createComment, getPostComments } from './../services/comment';

import { PADDING_ADJUST, isMobile, setTitle } from './../modules/common'
import { loadImages } from './../modules/image'
import { _ } from './../modules/translate'

import likeIcon from './../assets/icons/like.svg';
import activeLikeIcon from './../assets/icons/like-active.svg';
import commentIcon from './../assets/icons/comment.svg';
import starIcon from './../assets/icons/star.svg';
import activeStarIcon from './../assets/icons/star-active.svg';
import shareIcon from './../assets/icons/share.svg';

import './../css/post.css';

class Post extends React.Component {

  constructor(props) {
    super(props)

    this.abortController = new AbortController()
    this.loadPostsOnScroll = this.loadPostsOnScroll.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.deleteUserPhoto = this.deleteUserPhoto.bind(this)
    this.registerPostView = this.registerPostView.bind(this)
    this.focusOnComment = this.focusOnComment.bind(this)
    this.submitOnEnter = this.submitOnEnter.bind(this)
    this.toggleDropDown = this.toggleDropDown.bind(this)
    this.registerComment = this.registerComment.bind(this)
    this.getSimilarPosts = this.getSimilarPosts.bind(this)
    this.getComments = this.getComments.bind(this)
    this.updateImageDisplay = this.updateImageDisplay.bind(this)
    this.savePhoto = this.savePhoto.bind(this)
    this.likePost = this.likePost.bind(this)
    this.commentForm = React.createRef()
    this.postsContainer = React.createRef()
    this.renderSubscribeBtn = this.renderSubscribeBtn.bind(this)
    this.followUser = this.followUser.bind(this)

    this.state = {
      user: {
        id: '',
        username: '',
        profileUrl: ''
      },
      desktop: {
        url: ''
      },
      mobile: {
        url: ''
      },
      photoUrl: '',
      alt: '',
      id: '',
      publicId: '',
      likes: '',
      comments: '',
      time: '',
      caption: '',
      place: '',
      camera: {
        name: '',
        shutterSpeed: '',
        focalLength: '',
        iso: '',
        aperture: ''
      },
      tags: [],
      page: 1,
      commentPage: 1,
      posts: [],
      commentList: [],
      userComment: '',
      isUserLoggedIn: false,
      isUser: false,
      hasPosts: true,
      loadingPost: true,
      loadingComments: true,
      loadingSimilarPosts: true,
      isLikedByUser: false,
      isUserFavorite: false,
      isFollowedByUser: false,
      fullDisplay: false,
      hasDropDown: false,
    }
  }

  componentDidMount() {

    let publicId = this.props.match.params.publicId
    this.setState({publicId})
    this.loadPost(publicId)
    window.addEventListener('scroll', this.loadPostsOnScroll)
    window.scrollTo(0,0)

  }

  componentWillUnmount() {
    this.abortController.abort()
    window.removeEventListener('scroll', this.loadPostsOnScroll)
  }

  UNSAFE_componentWillReceiveProps(prevProps) {
    if (this.props.match.params.publicId === prevProps.match.params.publicId) return

    let publicId = prevProps.match.params.publicId
    this.setState({
      publicId,
      page: 1,
      posts: [],
      commentList: [],
      commentPage: 1,
      hasPosts: true
    })

    this.loadPost(publicId)

    window.scrollTo(0,0)
  }

  loadPostsOnScroll() {
    if (this.state.isUser) return

    let postsContainer = this.postsContainer.current
    let st = window.document.scrollingElement.scrollTop

    if ( this.state.loadingSimilarPosts ) return

    if (st >= postsContainer.offsetTop + (postsContainer.offsetHeight - 900) ) {
        if (this.state.hasPosts) this.getSimilarPosts()
      }
  }

  registerPostView() {
    createPostView({postId: this.state.id}, this.abortController.signal).catch(status => console.log(status))
  }

  getSimilarPosts() {
    let posts = []
    let body = {tags: [...this.state.tags]}

    this.setState({loadingSimilarPosts: true})

    getPhotosByTags(`${this.state.page}`, body, this.abortController.signal)
    .then( res => {
      const result = res.filter( post => post.id !== this.state.id )

      if (result.length < 1) {
        this.setState({loadingSimilarPosts: false, hasPosts: false})
        return
      }

      result.forEach( post => {
        let photoUrl, width, height, padding, naturalPadding

        if (isMobile()) {
          photoUrl = post.thumbnail.desktop.url
          width = post.thumbnail.desktop.size.width
          height = post.thumbnail.desktop.size.height
        } else {
          photoUrl = post.thumbnail.desktop.url
          width = post.thumbnail.desktop.size.width
          height = post.thumbnail.desktop.size.height
        }

        padding = (100 * height) / width
        naturalPadding = padding

        if (width <= height) padding = ( (100 * height) / width ) + PADDING_ADJUST

        posts.push({
          user: {
              id: post.user.id,
              username: post.user.username,
              profileUrl: post.user.profileUrl
          },
          thumbnail: {
            desktop: {
              url: post.thumbnail.desktop.url
            },
            mobile: {
              url: post.thumbnail.mobile.url
            }
          },
          photo: {
              mobile: {
                  url: post.photo.mobile.url
              },
              alt: post.photo.alt
          },
          id: post.id,
          publicId: post.publicId,
          likes: post.likes,
          comments: post.comments,
          time: post.time,
          isLikedByUser: post.isLikedByUser,
          isUserFavorite: post.isUserFavorite,
          padding,
          naturalPadding,
          photoUrl
        })
      } )

      this.setState({loadingSimilarPosts: false})

      if (posts.length > 0) {
        this.setState((state, props) => {
          return {
            page: state.page + 1,
            posts: [...state.posts, ...posts]
          }
        }, loadImages('post-img', this.state.posts.length))
      }
    })
    .catch( status => console.log(status))
  }

  registerComment() {
    let body = {
      postId: this.state.id,
      comment: this.state.userComment
    }

    if (body.comment === undefined || body.comment.trim() === '') return

    createComment(body, this.abortController.signal)
  .catch( status => console.log(status) )

    this.setState({userComment: ''})
    this.commentForm.current['userComment'].blur()

    this.setState( (state, props) => {
      let userData = JSON.parse(localStorage.getItem("data"))
      let oldCommentList = state.commentList

      oldCommentList.unshift({
          user: {
            id:  localStorage.getItem("id"),
            username:  userData.username,
            profileUrl:  userData.profileUrl,
          },
          id: localStorage.getItem("id") + new Date().getTime().toString(),
          comment: this.state.userComment.trim(),
          time:  new Date().toLocaleString()
        })

      return {
        commentList: [...oldCommentList],
        comments: state.comments + 1
      }
    } )
  }

  getComments() {
    this.setState({loadingComments: true})

    getPostComments(`${this.state.id}/${this.state.commentPage}`, this.abortController.signal)
    .then( result => {
      let commentList = result.map(comment => {
        return {
          user: {
            id:  comment.user.id,
            username:  comment.user.username,
            profileUrl:  comment.user.profileUrl,
          },
          id:  comment.id,
          comment: comment.comment,
          time:  new Date(comment.time).toLocaleString()
        }
      })

      if ( result.length > 0 ) {
        this.setState((state,props) => {
        return { commentPage: state.commentPage + 1 }
        })
      }

      this.setState( (state, props) => {
        return { 
          commentList: [...state.commentList, ...commentList] ,
          loadingComments: false,
        }
      })
    })
    .catch( status => console.log(status))

  }

  loadPost(publicId) {
    return getPhoto(publicId, this.abortController.signal)
    .then(post => {
      let photoUrl

      if (isMobile()) {
        photoUrl = post.photo.mobile.url
      } else {
        photoUrl = post.photo.desktop.quality.high.url
      }

      this.setState( (state, props) => {
        return { 
          user: {
            id: post.user.id,
            username: post.user.username,
            profileUrl: post.user.profileUrl
          },
          desktop: {
            url: post.photo.desktop.quality.high.url
          },
          mobile: {
            url: post.photo.mobile.url
          },
          alt: post.photo.alt,
          id: post.id,
          likes: post.likes,
          comments: post.comments,
          time: new Date(post.time).toLocaleString(),
          caption: post.caption,
          place: post.place.city ? `${post.place.city}, ${post.place.country}` : '',
          camera: {
            name: post.camera.name,
            shutterSpeed: post.camera.shutterSpeed,
            focalLength: post.camera.focalLength,
            iso: post.camera.iso,
            aperture: post.camera.aperture
          },
          tags: [...post.tags],
          isLikedByUser: post.isLikedByUser,
          isUserFavorite: post.isUserFavorite,
          isFollowedByUser: post.user.isFollowedByUser,
          isUser: post.isUser,
          photoUrl
        }
      }, () => {

        setTitle(`Photo (@${post.user.username})`)
        this.setState({loadingPost: false})
        this.registerPostView()
        this.getComments()

        if (!this.state.isUser) this.getSimilarPosts()
      })
    })
    .catch( status => console.log(status))
  }

  onInputChange(e) {
    const name = e.target.name
    const value = e.target.value

    this.setState({
      [name]: value,
      error: false 
    })
  }

  submitOnEnter(e) {
   if (e.key === 'Enter' && !e.shiftKey) this.registerComment()
  }

  followUser() {
    updateRelation({ id: this.state.user.id }, this.abortController.signal)
    .catch( status => console.log(status))
    this.setState( (state, prop) => {
      return { isFollowedByUser: !state.isFollowedByUser}
    })
  }

  likePost() {
    updatePhotoLike({postId: this.state.id}, this.abortController.signal)
    .catch( status => console.log(status))
    this.setState( (state, props) => {
      return {
        isLikedByUser: !state.isLikedByUser,
        likes: state.isLikedByUser ? state.likes - 1 : state.likes + 1
      }
    })
  }

  savePhoto() {
    setFavorite({postId: this.state.id}, this.abortController.signal)
    .catch( status => console.log(status))
    this.setState( (state, prop) => {
      return { isUserFavorite: !state.isUserFavorite}
    })
  }

  updateImageDisplay() {
    this.setState( (state,props) => { return {fullDisplay: !state.fullDisplay} } )
  }

  renderSubscribeBtn(){
    if ( !this.state.isFollowedByUser ) {
      return (
        <PrimaryButtonSmall name="subscribeBtn"
                          id="subscribeBtn"
                          type="button"
                          onClick={this.followUser}>
          {_("S'abonner")}
        </PrimaryButtonSmall>
        )
    }else {
      return (
        <SecondaryButtonSmall name="unSubscibeBtn"
                        id="unSubscibeBtn"
                        type="button"
                        onClick={this.followUser}>
        {_("Abonné")}
      </SecondaryButtonSmall>
      )
    }
  }

  deleteUserPhoto() {
    this.setState({loadPost: true})

    deletePhoto({postId: this.state.id}, this.abortController.signal)
    .then( () => window.location.href='/')
    .catch( status => console.log(status) )
  }

  focusOnComment() {
    window.scrollTo(0, this.commentForm.current.offsetTop + window.innerHeight)
    this.commentForm.current['userComment'].focus()
  }

  toggleDropDown() {
    this.setState( (state, props) => { return { hasDropDown: !state.hasDropDown } } )
  }

  render() {
    return (
      <div className="site-content col-100">
        <Header />
        <section className="post">
          { this.state.loadingPost ? <LoaderSpin loading={ this.state.loadingPost } size='30px'/> :
          <div className="content col-100">
            <div className="header">
              <div className="user">
                <Link to={'/user/' + this.state.user.username}>
                  <Avatar src={this.state.user.profileUrl}
                        size='74px'
                        alt={this.state.user.username} />
                </Link>
                <Link to={'/user/' + this.state.user.username}>
                  <h6>{this.state.user.username}</h6>
                </Link>
                { !this.state.isUser && this.renderSubscribeBtn() }
              </div>

              <div className="options">
                <button onClick={this.toggleDropDown}>
                  <span></span>
                  <span></span>
                  <span></span>
                </button>
                { this.state.hasDropDown &&
                  <div className="dropdown">
                    <ul>
                      <a className="col-100"
                        rel="noopener noreferrer"
                        href={"http://www.facebook.com/sharer.php?u=" + window.location.href} 
                        target="_blank">  
                        <li>
                          {_("Partager la photo")}
                        </li>
                      </a>
                      { this.state.isUser &&
                        <li className="delete" onClick={this.deleteUserPhoto}>
                          {_("Supprimer la photo")}
                        </li>
                      }
                    </ul>
                  </div>
                 }
              </div>
            </div>

            <div className="main">
              <div className="photo" style={{height: this.state.fullDisplay ? 'auto' : '600px'}}>
                <img src={API_URL + this.state.photoUrl} 
                     alt={this.state.alt} 
                     style={{ cursor: this.state.fullDisplay ? 'zoom-out' : 'zoom-in'  }}
                     onClick={this.updateImageDisplay}
                     onContextMenu={event => event.preventDefault()}/>
              </div>
              <div className="buttons">
                <div className="primary">
                  <IconButton id="likeBtn" 
                              size='40px' 
                              src={ this.state.isLikedByUser ? activeLikeIcon : likeIcon} 
                              onClick={this.likePost}/>

                  <IconButton id="commentBtn" 
                              size='40px' 
                              src={commentIcon} 
                              onClick={this.focusOnComment}/>

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
                                src={ shareIcon} />
                  </a>
                </div>
              </div>
              <div className="likes">
                <Link to={this.state.publicId + '/likes'}>
                  <h3>{this.state.likes} {_("j'aimes")}</h3>
                </Link>
              </div>

              <div className="info">
                <div className="camera">
                  <ul>
                    { this.state.place && 
                      <li>
                        <TextSecondary fontSize=".9rem">{_("Lieu")}</TextSecondary>
                        <TextePrimary fontSize="1.13rem">{this.state.place}</TextePrimary>
                      </li>
                    }
                    { this.state.camera.name && 
                      <li>
                        <TextSecondary fontSize=".9rem">{_("Caméra")}</TextSecondary>
                        <TextePrimary fontSize="1.13rem">{this.state.camera.name}</TextePrimary>
                      </li>
                    }
                    { this.state.camera.aperture && 
                      <li>
                        <TextSecondary fontSize=".9rem">{_("Diaphragme")}</TextSecondary>
                        <TextePrimary fontSize="1.13rem">{this.state.camera.aperture}</TextePrimary>
                      </li>
                    }
                    { this.state.camera.iso && 
                      <li>
                        <TextSecondary fontSize=".9rem">{_("ISO")}</TextSecondary>
                        <TextePrimary fontSize="1.13rem">{this.state.camera.iso}</TextePrimary>
                      </li>
                    }
                    { this.state.camera.iso && 
                      <li>
                        <TextSecondary fontSize=".9rem">{_("Vitesse d'obturation")}</TextSecondary>
                        <TextePrimary fontSize="1.13rem">{this.state.camera.shutterSpeed}</TextePrimary>
                      </li>
                    }
                  </ul>
                </div>
                <div className="caption">
                  <TextSecondary fontSize=".88rem">{this.state.time}</TextSecondary>
                  <TextePrimary fontSize="1.13rem">{this.state.caption}</TextePrimary>
                  <ul className="tag-list">
                    { this.state.tags.map( (tag, index) => {
                      return (
                        <li key={index}>
                          <Link to={`/search/?q=${tag}`}>{tag}</Link>
                        </li>
                        )
                    } ) }
                  </ul>
                </div>
                <div className="comment">
                  <TextSecondary fontSize="1.3rem">{this.state.comments} {_("Commentaires")}</TextSecondary>
                  <Form  name='commentForm'
                        ref={this.commentForm}>
                    <TextArea name="userComment" 
                             id="userComment"
                             type='text' 
                             placeholder={_("Commenter la photo")}
                             required={false}
                             onChange={ this.onInputChange }
                             onKeyPress={ this.submitOnEnter }
                             value={this.state.userComment } />
                  </Form>
                  <ul className="commentList">
                    { this.state.commentList.map( comment => {
                      return (
                        <li key={comment.id}>
                          <div className="commentImg">
                            <Avatar src={comment.user.profileUrl}
                                  size='38px'
                                  alt={comment.user.username} />
                          </div>
                          <div className="commentText">
                            <TextePrimary fontSize=".96rem">
                              <strong>
                              <Link to={`/user/${comment.user.username}`}>{comment.user.username}</Link> </strong> 
                              {comment.comment}
                            </TextePrimary>
                            <TextSecondary fontSize=".8rem">{comment.time}</TextSecondary>
                          </div>
                        </li>
                        )
                    } ) }
                    { this.state.loadingComments ? <LoaderSpin size="30px"/> : 
                      <TextButtonSecondary fontSize=".82rem"
                                           onClick={this.getComments}>
                        {_("Afficher plus de commentaires")}
                      </TextButtonSecondary>
                    }

                  </ul> 
                </div>
              </div>
            </div>    
            { !this.state.isUser && 
              <div className="posts col-100" ref={this.postsContainer}>
                <h1>{_("Photos similaires")}</h1>
                <PostList loading={this.state.loadingSimilarPosts} posts={ this.state.posts } />
              </div>
            }

            </div>
          }
        </section>
      </div>
    )
  }
}

export default Post;
