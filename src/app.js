import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { PrivateRoute } from './components/private-route'
import Registration from './pages/registration'
import Login from './pages/login'
import ForgotPassword from './pages/forgot-password'
import NewPassword from './pages/new-password'
import PopularUsers from './pages/popular-users'
import UserProfile from './pages/user-profile'
import Followers from './pages/followers'
import Following from './pages/following'
import NewPost from './pages/new-post'
import Post from './pages/post'
import Explore from './pages/explore'
import Feed from './pages/feed'
import Best from './pages/best'
import Search from './pages/search'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = ''
  }
  
  render(){
    return (
      <Router>
        <Switch>
          <Route path='/new-password/:passwordToken' component={NewPassword} />
          <PrivateRoute path='/user/:username/followers' component={Followers}/>
          <PrivateRoute path='/user/:username/following' component={Following}/>
          <Route path='/user/:username' component={UserProfile} />
          <Route path='/post/:publicId' component={Post}/>
          <Route path="/register" component={Registration}/>
          <Route path="/login" component={Login}/>
          <Route path='/forgot-password' component={ForgotPassword} />
          <PrivateRoute path='/users' component={PopularUsers}/>
          <Route path='/users' component={PopularUsers} />
          <PrivateRoute path='/new-post' component={NewPost}/>
          <Route path='/explore' component={Explore}/>
          <Route path='/search' component={Search}/>
          <PrivateRoute path='/best' component={Best}/>
          <PrivateRoute exact path='/' component={Feed}/>
        </Switch>
      </Router>
    );
  }
}

export default App;
