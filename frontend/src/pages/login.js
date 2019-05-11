import React from 'react';
import { Route, Redirect, Link } from "react-router-dom";

import Form from './../components/form.js'
import Input, { PasswordInput } from './../components/input'
import PrimaryButton, { TextButton } from './../components/button'
import ErrorMessage from './../components/error'
import Logo from './../components/logo'

import { loginUser as userLogin } from './../services/user'

import './../css/login.css'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.loginForm = React.createRef()
    this.loginUser = this.loginUser.bind(this)
    this.onInputChange = this.onInputChange.bind(this)

    this.state = {
      isUserLoggedIn: false,
      loading: false,
      error: false,
      errorMessage: null,
      username: '',
      password: ''
    }
  }

  componentWillMount() {
    if ( localStorage.getItem('tk') ) this.setState({isUserLoggedIn:true})
  }

  loginUser(e) {
    e.preventDefault()

    const body = {
      username: this.state.username,
      password: this.state.password
    }

    this.setState({loading: true})

    userLogin(body)
    .then( result => {
      const userData = {
        fullname: result.fullname,
        username: result.username,
        profileUrl: result.profileUrl,
        email: result.email,
        new: result.new
      }

      localStorage.setItem('id', result.id)
      localStorage.setItem('tk', result.sessionToken)
      localStorage.setItem('data', JSON.stringify(userData))

      this.setState({
        loading:false,
        isUserLoggedIn: true
      })

    } )
    .catch( status => {
      this.setState({
        error: true,
        loading:false
      })
      switch(status){
        case 404:
          this.setState({
            errorMessage: `Nom d'utilisateur ou mot de passe incorrect`
          })
          break
        default:
          this.setState({
            errorMessage: `Une erreur est survenue. Veuillez réessayez.`
          })
      }
    })
  }

  onInputChange(e) {
    const name = e.target.name
    const value = e.target.value
    this.setState({
      [name]: value,
      error: false,
      errorMessage: null 
    })
  }

  render() {
    const goToPage = this.props.location.state ? this.props.location.state.from.pathname : '/'

    if ( this.state.isUserLoggedIn ) {
      return(
        <Redirect to={{ pathname: goToPage }} />
        )
    }else {
      return (
        <div className="login col-100">
          <section className="form">
            <div className="content">
              <Logo />
              <ErrorMessage message={ this.state.errorMessage }/>
              <Form ref={ this.loginForm } 
                    name="loginForm"
                    onSubmit={ this.loginUser }>

                <label htmlFor="username">Nom d'utilisateur</label>
                <Input name="username"
                      id="username" 
                      type="text" 
                      placeholder="samueadewale"
                      required={true}
                      value={this.state.username} 
                      onChange={ this.onInputChange }/>

                <label htmlFor="password">Mot de passe</label>
                <PasswordInput name="password"
                      id="password" 
                      placeholder="••••••••••"
                      required={true}
                      value={this.state.password} 
                      onChange={ this.onInputChange }/>
                <PrimaryButton name="loginBtn"
                              id="loginBtn"
                              type="submit"
                              loading={ this.state.loading }>
                  Connexion
                </PrimaryButton>
                <span className="left">
                  <Link to="/forgot-password">
                    <TextButton fontSize="0.75rem">Mot de passe oublié ?</TextButton>
                  </Link>
                </span>
                <span className="right">
                  <Link to="/register">
                    <TextButton fontSize="0.75rem">Inscripton</TextButton>
                  </Link>
                </span>
              </Form>
            </div>
          </section>
        </div>
      )
    }
  }
}

export default Login;
