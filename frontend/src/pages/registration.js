import React from 'react';
import { Redirect, Link } from "react-router-dom";

import Form from './../components/form.js'
import Input, { PasswordInput } from './../components/input'
import PrimaryButton, { SecondaryButtonBig } from './../components/button'
import ErrorMessage from './../components/error'
import Logo from './../components/logo'

import { createUser } from './../services/user'

import './../css/registration.css'
import bgImage from './../assets/images/register-bg.jpg'

class Registration extends React.Component {
  constructor(props) {
    super(props)

    this.registerForm = React.createRef()
    this.createUserAccount = this.createUserAccount.bind(this)
    this.onInputChange = this.onInputChange.bind(this)

    this.state = {
      isUserLoggedIn: false,
      loading: false,
      error: false,
      errorMessage: null,
      email: '',
      fullname: '',
      username: '',
      password: ''
    }
  }

  componentWillMount() {
    if ( localStorage.getItem('tk') ) this.setState({isUserLoggedIn:true})
  }

  createUserAccount(e) {
    e.preventDefault()

    const body = {
      email: this.state.email,
      fullname: this.state.fullname,
      username: this.state.username,
      password: this.state.password
    }

    this.setState({loading: true})

    createUser(body)
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
        case 409:
          this.setState({
            errorMessage: `L'utilisateur existe déja. Choissiez un autre nom d'utilisateur`
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
        <div className="subscribe col-100">
        <Logo />
          <section className="image col-50" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="overlay dark"></div>
            <div className="content">
               <h1 className="big-title">
                 Découvrez et partagez de superbes photos
                 partout en afrique.
               </h1> 
               <Link to="/login">
                  <SecondaryButtonBig name="loginBtn"
                                      id="loginBtn"
                                      type="button"
                                      loading={ false }>
                    Connectez vous
                  </SecondaryButtonBig>
               </Link>
            </div>
          </section>
          <section className="form col-50">
            <div className="content">
              <h2>Creer un compte</h2>
              <ErrorMessage message={ this.state.errorMessage }/>
              <Form ref={ this.registerForm } 
                    name="registerForm"
                    onSubmit={ this.createUserAccount }>

                <label htmlFor="fullname">Nom complet</label>
                <Input name="fullname"
                      id="fullname" 
                      type="text" 
                      placeholder="Samuel Adewale"
                      required={false}
                      value={this.state.fullname} 
                      onChange={ this.onInputChange }/>

                <label htmlFor="username">Nom d'utilisateur</label>
                <Input name="username"
                      id="username" 
                      type="text" 
                      placeholder="samueadewale"
                      required={true}
                      value={this.state.username} 
                      onChange={ this.onInputChange }/>
                      
                <label htmlFor="email">Adresse email</label>
                <Input name="email" 
                      id="email"
                      type="email" 
                      placeholder="samroberval@gmail.com"
                      required={true}
                      value={this.state.email} 
                      onChange={ this.onInputChange }/>

                <label htmlFor="password">Mot de passe</label>
                <PasswordInput name="password"
                      id="password" 
                      placeholder="•••••••••••••••"
                      required={true}
                      value={this.state.password} 
                      onChange={ this.onInputChange }/>
                <PrimaryButton name="registerBtn"
                              id="registerBtn"
                              type="submit"
                              loading={ this.state.loading }>
                  Inscription
                </PrimaryButton>
                <Link to="/login">
                  <SecondaryButtonBig name="loginBtn"
                                        id="loginBtn"
                                        type="button"
                                        loading={ false }>
                      Connectez vous
                  </SecondaryButtonBig>
                </Link>

              </Form>
            </div>
          </section>
        </div>
      )
    }
  }
}

export default Registration;
