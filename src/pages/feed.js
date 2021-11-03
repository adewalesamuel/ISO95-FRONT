import React from 'react';

import Header from './../components/header';
import PostList from './../components/post-list';

import { getFeedPhotos } from './../services/post';

import { isMobile, setTitle } from './../modules/common'
import { loadImages } from './../modules/image'

import './../css/feed.css'


class Feed extends React.Component {

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

    setTitle("Feed")
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

    return getFeedPhotos(`${this.state.page}`, this.abortController.signal)
    .then( result => {
        if (result.length < 1) {
        this.setState({loading: false, hasPosts: false})
        return
      }

      result.forEach( post => {
        let photoUrl, width, height, padding

        if (isMobile()) {
          photoUrl = post.photo.mobile.url
          width = post.photo.mobile.size.width
          height = post.photo.mobile.size.height
        } else {
          photoUrl = post.photo.desktop.quality.medium.url
          width = post.photo.desktop.quality.medium.size.width
          height = post.photo.desktop.quality.medium.size.height
        }
        padding = (100 * height) / width

        posts.push({
          user: {
              id: post.user.id,
              username: post.user.username,
              profileUrl: post.user.profileUrl
          },
          photo: {
            desktop: {
              quality: {
                medium: {
                  size: {
                    width: post.photo.desktop.quality.medium.size.width,
                    height: post.photo.desktop.quality.medium.size.height
                  },
                  url: post.photo.desktop.quality.medium.url
                }
              }
            },
            mobile: {
              size: {
                  width: post.photo.mobile.size.width,
                  height: post.photo.mobile.size.height
              },
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
          naturalPadding: padding,
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
        <section className="feed">
           <div className="content">
            <div ref={this.postsContainer} className="posts col-100">
              <PostList loading={this.state.loading} posts={ this.state.posts } />
            </div>
           </div> 
        </section>
      </div>
    )
    }
  }

export default Feed;
