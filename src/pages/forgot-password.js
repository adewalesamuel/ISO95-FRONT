import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

import Form from './../components/form.js'
import Input from './../components/input'
import PrimaryButton, { TextButton } from './../components/button'
import ErrorMessage from './../components/error'
import Logo from './../components/logo'
import { TextSecondary } from './../components/text'

import { sendPasswordToken as sendToken } from './../services/user'

import { setTitle } from './../modules/common'
import { _ } from './../modules/translate'

import './../css/forgot-password.css'
import successCheck from './../assets/icons/success-check.png'

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props)

    this.forgotPassordForm = React.createRef()
    this.sendPasswordToken = this.sendPasswordToken.bind(this)
    this.onInputChange = this.onInputChange.bind(this)

    this.state = {
      hasSentToken: false,
      loading: false,
      error: false,
      errorMessage: null,
      email: ''
    }
  }

  componentDidMount(){
    setTitle("Forgot Password")
  }

  sendPasswordToken(e) {
    e.preventDefault()

    const body = {
      email: this.state.email,
    }

    this.setState({loading: true})

    sendToken(body)
    .then( result => {

      this.setState({
        loading:false,
        hasSentToken: true
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
            errorMessage: `${_("Cette adresse email n'existe pas")}`
          })
          break
        default:
          this.setState({
            errorMessage: `${_("Une erreur est survenue")}. ${_("Veuillez réessayez")}.`
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
    return (
      <div className="forgot-password col-100">
        <Logo />
        <section className="form">
          <div className="content card">
            { !this.state.hasSentToken ?
              <Fragment>
                <h2>{_("Mot de passe oublié")} ?</h2>
                <TextSecondary>
                {_("Entrez votre adresse email et vous recevrez un lien pour creer un nouveau mot de passe")}
                </TextSecondary>
                <ErrorMessage message={ this.state.errorMessage }/>
                <Form ref={ this.forgotPassordForm } 
                      name="forgotPassordForm"
                      onSubmit={ this.sendPasswordToken }>

                  <Input name="email"
                        id="email" 
                        type="email" 
                        placeholder="samroberval@gmail.com"
                        required={true}
                        value={this.state.email} 
                        onChange={ this.onInputChange }/>

                  <PrimaryButton name="sendTokenBtn"
                                id="sendTokenBtn"
                                type="submit"
                                loading={ this.state.loading }>
                    {_("Envoyer le lien")}
                  </PrimaryButton>
                  <span className="left">
                    <Link to="/login">
                      <TextButton fontSize="0.75rem">{_("Connectez-vous")}</TextButton>
                    </Link>
                  </span>
                  <span className="right">
                    <Link to="/register">
                      <TextButton fontSize="0.75rem">{_("Inscription")}</TextButton>
                    </Link>
                  </span>
                </Form>
              </Fragment>
            :
            <Fragment>
              <img className="success-icon" alt="succes" src={successCheck}/>
              <h2>{_("Lien envoyé")}</h2>
              <TextSecondary>
               {_("Le lien pour creer un nouveau mot de passe vous à été envoyé")}.
              </TextSecondary>
            </Fragment>
             }
            
          </div>
        </section>
      </div>
    )
  }
}

export default ForgotPassword;
