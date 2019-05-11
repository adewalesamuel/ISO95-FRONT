import React from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Registration from './pages/registration'
import Login from './pages/login'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = ''
  }
  render(){
    return (
      <Router>
        <Route exact path="/register" component={Registration}/>
        <Route exact path="/login" component={Login}/>
      </Router>
    );
  }
}

export default App;
