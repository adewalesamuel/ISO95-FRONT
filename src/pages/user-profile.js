import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

import PrimaryButtonBig, { SecondaryButtonBig, SecondaryButtonSmall } from './../components/button';
import { TextSecondary, TextePrimary } from './../components/text';
import Header from './../components/header';
import LoaderSpin from './../components/loader';
import Avatar from './../components/avatar';
import Form from './../components/form';
import Input, { TextArea } from './../components/input';
import PostList from './../components/post-list';

import { getUser, updateUser } from './../services/user';
import { updateRelation } from './../services/relation';
import { getUserPhotos, getUserFavorites } from './../services/post';
import { API_URL } from './../services/api';

import { PADDING_ADJUST, isMobile, setTitle } from './../modules/common'
import { loadImages } from './../modules/image'
import { _ } from './../modules/translate'

import placeIcon from './../assets/icons/place.svg';
import envelopeIcon from './../assets/icons/envelope.svg';
import linkIcon from './../assets/icons/link.svg';

import './../css/user-profile.css';

class UserProfile extends React.Component {

  constructor(props) {
    super(props)

    this.abortController = new AbortController()
    this.loadUserPosts = this.loadUserPosts.bind(this)
    this.postsContainer = React.createRef()
    this.loadPostsOnScroll = this.loadPostsOnScroll.bind(this)
    this.loadUserFavorites = this.loadUserFavorites.bind(this)
    this.updateProfile = this.updateProfile.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.profileForm = React.createRef()
    this.avatarFile = React.createRef()
    this.updateProfileImage = this.updateProfileImage.bind(this)
    this.getUserInfo = this.getUserInfo.bind(this)
    this.renderPostBtn = this.renderPostBtn.bind(this)
    this.renderSubscribeBtn = this.renderSubscribeBtn.bind(this)
    this.followUser = this.followUser.bind(this)


    this.state = {
      id: '',
      fullname: '',
      username: '',
      profileUrl: '',
      followers: null,
      following: null,
      description: '',
      email: '',
      tel: '',
      website: '',
      place: '',
      numPost: null,
      postPage: 1,
      favoritePage: 1,
      posts: [],
      favorites: [],
      hasFavorites: true,
      hasPosts: true,
      isFollowedByUser: false,
      isUserLoggedIn: false,
      isUser: false,
      loadingInfo: false,
      postLoading: false,
      updating: false,
      avatarLoading: false,
      photoType: 1
    }
  }

  componentDidMount() {

    this.getUserInfo()
    .then( () =>  {
      setTitle(`${this.state.fullname} (@${this.state.username})`)
      this.loadUserPosts()
    } )
    window.addEventListener('scroll', this.loadPostsOnScroll)
  }

  componentWillUnmount() {
    this.abortController.abort()
    window.removeEventListener('scroll', this.loadPostsOnScroll)
  }

  loadPostsOnScroll() {

    let postsContainer = this.postsContainer.current
    let st = window.document.scrollingElement.scrollTop

    if ( this.state.postLoading || !postsContainer) return

    if (st >= postsContainer.offsetTop + (postsContainer.offsetHeight - 900) ) {
        if (this.state.photoType === 1) {
          if (this.state.hasPosts) this.loadUserPosts()
        }
        if (this.state.photoType === 2) {
          if (this.state.hasFavorites) this.loadUserFavorites()
        }
      }
  }

  showUserPhotos() {
    if (this.state.photoType === 1) return

    this.setState({
      favorites: [],
      photoType: 1, 
      favoritePage: 1,
      hasPosts: true
    })
    this.loadUserPosts()
  }

  showUserFavorites(){
    if (this.state.photoType === 2) return

    this.setState({
      posts: [],
      photoType: 2, 
      postPage: 1,
      hasPosts: true
    })
    this.loadUserFavorites()
  }

  loadUserPosts() {
    let posts = []
    this.setState({postLoading: true})

    return getUserPhotos(`${this.state.username}/${this.state.postPage}`, this.abortController.signal)
    .then( result => {
      if (result.length < 1) {
        this.setState({postLoading: false, hasPosts: false})
        return
      }

      result.forEach( post => {
        let photoUrl, width, height, padding, naturalPadding

        if (isMobile()) {
          photoUrl = post.thumbnail.mobile.url
          width = post.thumbnail.mobile.size.width
          height = post.thumbnail.mobile.size.height
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
              size: {
                width: post.thumbnail.desktop.size.width,
                height: post.thumbnail.desktop.size.height,
              },
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

      this.setState({postLoading: false})

      if (posts.length > 0) {
        this.setState((state, props) => {
          return {
            postPage: state.postPage + 1,
            posts: [...state.posts, ...posts]
          }
        }, loadImages('post-img', this.state.posts.length))
      }

    } )
    .catch(err => console.log(err))
  }

  loadUserFavorites() {
    let posts = []
    this.setState({postLoading: true})

    return getUserFavorites(`${this.state.username}/${this.state.favoritePage}`, this.abortController.signal)
    .then( result => {

      if (result.length < 1) {
        this.setState({postLoading: false, hasFavorites: false})
      }

      result.forEach( post => {
        let photoUrl, width, height, padding, naturalPadding

        if (isMobile()) {
          photoUrl = post.thumbnail.mobile.url
          width = post.thumbnail.mobile.size.width
          height = post.thumbnail.mobile.size.height
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
              size: {
                width: post.thumbnail.desktop.size.width,
                height: post.thumbnail.desktop.size.height,
              },
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

      this.setState({postLoading: false})

      if (posts.length > 0) {
        this.setState((state, props) => {
          return {
            favoritePage: state.favoritePage + 1,
            favorites: [...state.favorites, ...posts]
          }
        }, loadImages('post-img', this.state.favorites.length))
      }

    } )
    .catch(err => console.log(err))
  }

  updateProfile(e){
    e.preventDefault()

    this.setState({updating: true})

    let place = this.state.place
    if (place.includes(',')) place = place.split(',')

    const body = {
      fullname: this.state.fullname,
      description: this.state.description,
      email: this.state.email,
      website: this.state.website,
      place: {
        city: place instanceof Array ? place[0].trim() : place,
        country: place instanceof Array ? place[1].trim() : ''
      },
      tel: this.state.tel
    }

    updateUser(body, this.abortController.signal)
    .then( result => {
      this.setState({updating: false})
      window.location.reload()
    } )
    .catch(err => this.setState({updating: false}))
  }

  onInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value
    })
  }

  followUser() {
    updateRelation({ id: this.state.id }, this.abortController.signal).catch( status => console.log(status))
    this.setState( (state, prop) => {
      return { isFollowedByUser: !state.isFollowedByUser}
    })
  }

  getUserInfo() {
    const username = this.props.match.params.username
    this.setState({loadingInfo: true})

    return getUser(username, this.abortController.signal)
    .then( result => {

      const place = `${result.place.city}, ${result.place.country}`

      this.setState({
        description: result.description,
        email: result.email,
        fullname: result.fullname,
        id: result.id,
        isFollowedByUser: result.isFollowedByUser,
        isUser: result.isUser,
        place: place.trim() === ',' ? '' : place,
        numPost: result.posts,
        profileUrl: result.profileUrl,
        followers: result.relations.followers,
        following: result.relations.followings,
        username: result.username,
        website: result.website,
        loadingInfo: false
      })
    } )
    .catch( status => { console.log(status) })
  }

  updateProfileImage() {
  	let formData = new FormData()
  	const file = this.avatarFile.current.files[0]

    if (!file || !this.isValidImageFile(file.name) ) return

  	this.setState({profileUrl: window.URL.createObjectURL(file)})

    let userData = JSON.parse(localStorage.getItem('data'))
    userData.profileUrl = window.URL.createObjectURL(file)
    localStorage.setItem('data', JSON.stringify(userData))

  	formData.append('profileImage',file)
  	this.sendFile(formData)
  }

  isValidImageFile(filename) {
  	let validExtentions = ['jpg', 'png', 'jpeg']
  	let fileExtention = filename.split('.')[filename.split('.').length - 1].toLowerCase()
  	if (validExtentions.indexOf(fileExtention) === -1) return false
  	return true
  }

  sendFile(formData, route) {
  	const xhr = new XMLHttpRequest()
  	xhr.addEventListener('load', e => {
  		this.setState({avatarLoading: false})
  	})
  	xhr.upload.addEventListener('progress', e => {
  		this.setState({avatarLoading: true})
  	})
  	xhr.addEventListener('error', e => console.log("Error"))

  	xhr.open('POST', `${API_URL}/api/user/profile/avatar`)
  	xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('tk')}`)

  	xhr.send(formData)
  }


  renderPostBtn(){
    return (
      <Link to='/new-post'>
        <PrimaryButtonBig name="newPostBtn"
                          id="newPostBtn"
                          type="button">
          {_("Poster une photo")}
        </PrimaryButtonBig>
      </Link>
      )
  }

  renderSubscribeBtn(){
    if ( !this.state.isFollowedByUser ) {
      return (
        <PrimaryButtonBig name="subscibeBtn"
                          id="subscibeBtn"
                          type="button"
                          onClick={this.followUser}>
          S'abonner
        </PrimaryButtonBig>
        )
    }else {
      return (
        <SecondaryButtonBig name="unSubscibeBtn"
                        id="unSubscibeBtn"
                        type="button"
                        onClick={this.followUser}>
        Abonné
      </SecondaryButtonBig>
      )
    }
  }

  render() {
    return (
      <div className="site-content col-100">
        <Header />
        <section className="user-profile">
        { this.state.loadingInfo ? <LoaderSpin loading={ this.state.loadingInfo } size='30px'/> :
          <Fragment>
            <section className="header col-100">
             <div className="user">
             	<div className="image">
             		<Avatar src={this.state.profileUrl}
             	        size='200px'
             	        alt={this.state.username} />
             		{ this.state.isUser &&
             			<div className="overlay" 
             					 style={{ opacity: (this.state.profileUrl === '' || this.state.avatarLoading) ? 1 : 0 }}
             					 onClick={ () => null }>
             				<SecondaryButtonSmall name="avatarUpdateBtn"
																					id='avatarUpdateBtn'
																					type='button'
																					loading={this.state.avatarLoading}
																					onClick={ () => null }>
											{_("Choisir une photo")}  					
             				</SecondaryButtonSmall>
                    <input ref={this.avatarFile} 
                       type="file" 
                       name="avatar" 
                       id="avatar"
                       onChange={this.updateProfileImage} />
             			</div>
             	   }
             	</div>
               <div className='names'>
                 <h4>{this.state.username}</h4>
                 <h1 className='title'>{this.state.fullname}</h1>
               </div>
             </div>
             <div className='buttons'>
               { this.state.isUser ? 
                 this.renderPostBtn() :
                 this.renderSubscribeBtn() }
             </div>
            </section>

            <section className="body">
             <div className="stats">
               <div className="photo">
                 <h1 className="big-title">{ this.state.numPost }</h1>
                 <TextSecondary fontSize="1.22rem">{_("Photos")}</TextSecondary>
               </div>
               <div className="followers-count">
                 <Link to={{ pathname: `${this.state.username}/followers`, state: {modal: false}}}>
                    <h1 className="big-title">{ this.state.followers }</h1>                   
                 </Link>
                 <TextSecondary fontSize="1.22rem">{_("Abonnés")}</TextSecondary>
               </div>
               <div className="following-count">
                 <Link to={{ pathname: `${this.state.username}/following`, state: {modal: true}}}>
                  <h1 className="big-title">{ this.state.following }</h1>
                 </Link>
                 <TextSecondary fontSize="1.22rem">{_("Abonnements")}</TextSecondary>
               </div>
             </div>

             <div className="info">
               { !this.state.isUser ?
                 <Fragment>
                   <TextePrimary fontSize="1.15rem">
                     { this.state.description }
                   </TextePrimary>
                   <ul>
                     { this.state.place && 
                       <li>
                         <img src={placeIcon} alt='' width='20px' />
                         <em>{ this.state.place }</em>
                       </li>
                      }
                      { this.state.email && 
                       <li>
                         <img src={envelopeIcon} alt='' width='20px' />
                         <em>{ this.state.email }</em>
                       </li>
                      }
                      { this.state.website && 
                       <li>
                         <img src={linkIcon} alt='' width='20px' />
                         <em>{ this.state.website }</em>
                       </li>
                      }
                   </ul>
                 </Fragment> : 
                 <Form ref={ this.profileForm } 
                       name="profileForm"
                       onSubmit={ this.updateProfile }>
                   <label htmlFor="description">{_("Description")}</label>
                   <TextArea name="description"
                            id="description"
                            placeholder={_("Parlez nous de vous")}
                            required={false}
                            value={this.state.description}
                            onChange={ this.onInputChange }/>

                   <label htmlFor="place">{_("Localisation")}</label>         
                   <Input name="place"
                         id="place" 
                         type="text"
                         placeholder="Abidjan, Côte d'Ivoire"
                         required={false}
                         value={this.state.place} 
                         onChange={ this.onInputChange }/>

                   <label htmlFor="email">{_("Adresse email")}</label>         
                   <Input name="email"
                         id="email" 
                         type="email"
                         placeholder=""
                         required={false}
                         value={this.state.email}
                         onChange={ () => null} />

                   <label htmlFor="website">{_("Site Web")}</label>         
                   <Input name="website"
                         id="website" 
                         type="text"
                         placeholder="www.site.com"
                         required={false}
                         value={this.state.website} 
                         onChange={ this.onInputChange }/>
                   <SecondaryButtonBig name="updateProfileBtn"
                                     id="updateProfileBtn"
                                     type="submit"
                                     loading={ this.state.updating }>
                     {_("Modifier")}
                   </SecondaryButtonBig>
                 </Form>
                }
             </div>
            </section>
            <section className="posts" ref={this.postsContainer}>
             <div className="top">
               <div className="post-nav">
                 <button onClick={ () => this.showUserPhotos()}>
                   <h1 style={{opacity: this.state.photoType === 2 ? 0.3 : 1}}>{_("Photos")}</h1>
                 </button>
                 { this.state.isUser && 
                  <button onClick={ () => this.showUserFavorites() }>
                    <h1 style={{opacity: this.state.photoType === 1 ? 0.3 : 1}}>{_("Mes favoris")}</h1>
                  </button>
                 }
               </div>
             </div>
            <PostList loading={this.state.postLoading} 
                      posts={ this.state.photoType === 1 ? this.state.posts : this.state.favorites } />
            </section>
          </Fragment>
          }
        </section>
      </div>
    )
  }
}

export default UserProfile;
