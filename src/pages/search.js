import React from 'react';

import Header from './../components/header';
import PostList from './../components/post-list';

import { searchPhotos } from './../services/post';

import { parseQueryString, PADDING_ADJUST, setTitle } from './../modules/common'
import { loadImages } from './../modules/image'
import { _ } from './../modules/translate'

import './../css/search.css'


class Search extends React.Component {

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

    setTitle("Search: " + parseQueryString(this.props.location.search).q)
    this.loadPosts()
    window.addEventListener('scroll', this.loadPostsOnScroll)
  }

  UNSAFE_componentWillReceiveProps(props) {
    const oldQ = parseQueryString(props.location.search).q
    const newQ = parseQueryString(this.props.location.search).q

    if ( oldQ === newQ ) return

    this.setState({
      posts: [],
      loading: true,
      page: 1,
      hasPosts: true,
    })

    window.setTimeout(() => this.loadPosts(), 100)
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
    const q = parseQueryString(this.props.location.search).q

    this.setState({loading: true})

    return searchPhotos(`?q=${q}&page=${this.state.page}`, this.abortController.signal)
    .then( result => {

      if (result.length < 1) {
        this.setState({loading: false, hasPosts: false})
      }

      result.forEach( post => {
        let padding
        let photoUrl = post.thumbnail.desktop.url
        let { width, height } = post.thumbnail.desktop.size
        padding = (100 * height) / width
        let naturalPadding = padding

        if (width <= height) padding = ( (100 * height) / width ) + PADDING_ADJUST

        posts.push({
          user: {
              id: post.user.id,
              username: post.user.username,
              profileUrl: post.user.profileUrl
          },
          photo: {
            alt: post.photo.alt
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
          id: post.id,
          publicId: post.publicId,
          likes: post.likes,
          comments: post.comments,
          time: post.time,
          isLikedByUser: post.isLikedByUser,
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

        <section className="search">
           <div className="content">
            <h1>{_("Rechercher")}: {parseQueryString(this.props.location.search).q}</h1>
            <div ref={this.postsContainer} className="posts col-100">
              <PostList loading={this.state.loading} posts={ this.state.posts } />
            </div>
           </div> 
        </section>
      </div>
    )
    }
  }

export default Search;
