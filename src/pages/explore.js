import React from 'react';

import Header from './../components/header';
import PostList from './../components/post-list';

import { getDisoverPhotos } from './../services/post';

import { PADDING_ADJUST, isMobile, setTitle } from './../modules/common'
import { loadImages } from './../modules/image'
import { _ } from './../modules/translate'

import './../css/explore.css'


class Explore extends React.Component {

  constructor(props) {
    super(props)

    this.abortController = new AbortController()
    this.loadPosts = this.loadPosts.bind(this)
    this.postsContainer = React.createRef()
    this.loadPostsOnScroll = this.loadPostsOnScroll.bind(this)
    this.state = {
      posts: [],
      loading: true,
      page: 1,
      hasPosts: true
    }
  }

  componentDidMount() {

    setTitle("Explore")
    this.loadPosts()
    window.addEventListener('scroll', this.loadPostsOnScroll)
  }

  componentWillUnmount() {
    this.abortController.abort()
    window.removeEventListener('scroll', this.loadPostsOnScroll)
  }

  loadPostsOnScroll() {

    let postsContainer = this.postsContainer.current
    let st = window.document.scrollingElement.scrollTop

    if ( this.state.loading ) return

    if (st >= postsContainer.offsetTop + (postsContainer.offsetHeight - 1000) ) {
        if (this.state.hasPosts) this.loadPosts()
      }
  }


  loadPosts() {
    let posts = []
    this.setState({loading: true})

    return getDisoverPhotos(`${this.state.page}`, this.abortController.signal)
    .then( result => {
        if (result.length < 1) {
        this.setState({loading: false, hasPosts: false})
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

      this.setState({loading: false})

      if (posts.length > 0) {
        this.setState((state, props) => {
          return {
            page: state.page + 1,
            posts: [...state.posts, ...posts]
          }
        }, loadImages('post-img', this.state.posts.length))
      }

    } )
    .catch(err => console.log(err))
  }


  render() {
    return (
      <div className="site-content col-100">
        <Header />

        <section className="explore">
           <div className="content">
            <h1>{_("Explorer")}</h1>
            <div ref={this.postsContainer} className="posts col-100">
              <PostList loading={this.state.loading} posts={ this.state.posts } />
            </div>
           </div> 
        </section>
      </div>
    )
    }
  }

export default Explore;
