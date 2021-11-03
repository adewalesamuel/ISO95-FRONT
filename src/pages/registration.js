import React from 'react';
import { Redirect, Link } from "react-router-dom";

import Form from './../components/form.js'
import Input, { PasswordInput } from './../components/input'
import PrimaryButton, { SecondaryButtonBig } from './../components/button'
import ErrorMessage from './../components/error'
import Logo from './../components/logo'

import { createUser } from './../services/user'

import { setTitle } from './../modules/common'
import { _ } from './../modules/translate'

import './../css/registration.css'

class Registration extends React.Component {
  constructor(props) {
    super(props)

    this.registerForm = React.createRef()
    this.pageToGo = '/'
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

  componentDidMount() {
    setTitle("Register")
    if ( this.props.location.state ) {
      this.pageToGo = this.props.location.state.from.pathname
    }
    if ( localStorage.getItem('tk') ) this.setState({isUserLoggedIn:true})
  }

  createUserAccount(e) {
    e.preventDefault()

    const body = {
      email: this.state.email.trim(),
      fullname: this.state.fullname.trim(),
      username: this.state.username.trim(),
      password: this.state.password.trim()
    }

    if ( body.email === '' || body.fullname === '' || body.username === '' 
      || body.password === '') return

    this.setState({loading: true})

    createUser(body)
    .then( result => {
      const userData = {
        fullname: result.fullname,
        username: result.username,
        profileUrl: result.profileUrl,
        email: result.email,
      }

      if ( result.relations.followings < 1 ) this.pageToGo = '/users'

      localStorage.setItem('id', result.id)
      localStorage.setItem('data', JSON.stringify(userData))
      localStorage.setItem('tk', result.sessionToken)

      window.location.replace(this.pageToGo);

    } )
    .catch( status => {
      this.setState({error: true,loading:false})

      switch(status){
        case 409:
          this.setState({
            errorMessage: `${_("L'utilisateur existe déja")}. ${_("Choisissez un autre nom d'utilisateur")}.`
          })
          break
        default:
          this.setState({
            errorMessage: `${_("Une erreur est survenue")}. ${_("Veuillez réessayer")}.`
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
    if ( this.state.isUserLoggedIn ) {
      return(
        <Redirect to={{ pathname: this.pageToGo }} />
        )
    }else {
      return (
        <div className="subscribe col-100">
        <Logo />
          <section className="image col-50" style={{ backgroundImage: `url(/uploads/public/images/register-bg.jpg)` }}>
            <div className="overlay dark"></div>
            <div className="content">
               <h1 className="big-title">
                { _('Découvrez et partagez de superbes photos partout en afrique.') }
               </h1> 
               <Link to="/login">
                  <SecondaryButtonBig name="loginBtn"
                                      id="loginBtn"
                                      type="button"
                                      loading={ false }>
                    {_('Connectez-vous')}
                  </SecondaryButtonBig>
               </Link>
            </div>
          </section>
          <section className="form col-50">
            <div className="content">
              <h2>{_('Creer un compte')}</h2>
              <ErrorMessage message={ this.state.errorMessage }/>
              <Form ref={ this.registerForm } 
                    name="registerForm"
                    onSubmit={ this.createUserAccount }>

                <label htmlFor="fullname">{_("Nom complet")}</label>
                <Input name="fullname"
                      id="fullname" 
                      type="text" 
                      placeholder="Samuel Adewale"
                      required={true}
                      value={this.state.fullname} 
                      onChange={ this.onInputChange }/>

                <label htmlFor="username">{_("Nom d'utilisateur")}</label>
                <Input name="username"
                      id="username" 
                      type="text" 
                      placeholder="samueadewale"
                      required={true}
                      value={this.state.username} 
                      pattern="[A-Za-z0-9_]*"
                      title="Entrez des caractères alphanumériques"
                      onChange={ this.onInputChange }/>
                      
                <label htmlFor="email">{_("Adresse email")}</label>
                <Input name="email" 
                      id="email"
                      type="email" 
                      placeholder="samroberval@gmail.com"
                      required={true}
                      value={this.state.email} 
                      onChange={ this.onInputChange }/>

                <label htmlFor="password">{_("Mot de passe")}</label>
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
                  {_("Inscription")}
                </PrimaryButton>
                <Link to="/login">
                  <SecondaryButtonBig name="loginBtn"
                                        id="loginBtn"
                                        type="button"
                                        loading={ false }>
                    {_("Connectez-vous")}
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
