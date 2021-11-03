import React from 'react';

import PostCard from './../components/post-card'
import { PostLoaderSpin } from './../components/loader';

import './../css/post-list.css'

function PostList(props) {

  function rearangePosts() {
    const posts = [...props.posts]
    let sortedPosts = []

    while (posts.length > 0) {

      if ( !posts[0].thumbnail ) {
        sortedPosts = [...posts]
        break
      }

      let firstPost = posts[0].thumbnail.desktop.size
      let secondPost = posts[1] ? posts[1].thumbnail.desktop.size : null
      let thirdPost = posts[2] ? posts[2].thumbnail.desktop.size : null

      if (!thirdPost) {
        sortedPosts = [...sortedPosts, ...posts.splice(0,2)]
        break
      }

      if (!secondPost) {
        sortedPosts = [...sortedPosts, ...posts.splice(0,1)]
        break
      }

      if ( (firstPost.height < firstPost.width && secondPost.height < secondPost.width) || 
          (firstPost.height >= firstPost.width && secondPost.height >= secondPost.width) ) {

        sortedPosts = [...sortedPosts, ...posts.splice(0,2)]

      }else if ( (secondPost.height >= secondPost.width && thirdPost.height >= thirdPost.width) ){

        sortedPosts = [...sortedPosts, ...posts.splice(1,2)]

      }
      else if ( (firstPost.height < firstPost.width && thirdPost.height < thirdPost.width) || 
          (firstPost.height >= firstPost.width && thirdPost.height >= thirdPost.width) ) {

        let postArr = [...posts.splice(0,1), ...posts.splice(1,1)]
        sortedPosts = [...sortedPosts, ...postArr]

      } else {
        sortedPosts = [...sortedPosts, ...posts.splice(0,3)]
      }
    }

    return sortedPosts
  }

  return (
    <div className="post-list-container">
      <ul  className="post-list col-100">
        { rearangePosts().map( (post, index) => {
          return (
            <li key={post.id + index }>
             <PostCard post={post}/>
            </li>
            )
        }) 
        }
      </ul>
      <PostLoaderSpin size='30px' loading={props.loading}/>
    </div>
  )
}

export default PostList