import React, { Fragment } from 'react';
import { Link } from "react-router-dom";

import Form from './../components/form.js'
import Input from './../components/input'
import PrimaryButton, { TextButton } from './../components/button'
import ErrorMessage from './../components/error'
import Logo from './../components/logo'
import { TextSecondary } from './../components/text'

import { updatePassword as updateUserPassword } from './../services/user'

import { setTitle } from './../modules/common'
import { _ } from './../modules/translate'

import './../css/new-password.css'
import successCheck from './../assets/icons/success-check.png'

class NewPassword extends React.Component {
  constructor(props) {
    super(props)

    this.newPassordForm = React.createRef()
    this.updatePassword = this.updatePassword.bind(this)
    this.onInputChange = this.onInputChange.bind(this)

    this.state = {
      hasUpdatedPassword: false,
      loading: false,
      error: false,
      errorMessage: null,
      password: '',
      cpassword: ''
    }
  }

  componentDidMount() {
    setTitle("New Password")
  }

  updatePassword(e) {
    e.preventDefault()

    if (this.state.password !== this.state.cpassword) {
      this.setState({
        error: true,
        errorMessage: `${_("Le mot de passe ne correspond pas")}`,
      })
      return
    }

    const body = {
      id: this.props.match.params.passwordToken,
      newPassword: this.state.password,
    }

    this.setState({loading: true})

    updateUserPassword(body)
    .then( result => {

      this.setState({
        loading:false,
        isUserLoggedIn: true,
        hasSentToken: true
      })

    } )
    .catch( status => {
      this.setState({
        error: true,
        loading:false
      })
      switch(status){
        case 403:
          this.setState({
            errorMessage: `${_("Le token n'est pas valide.")}`
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
    return (
      <div className="new-password col-100">
        <Logo />
        <section className="form">
          <div className="content card">
            { !this.state.hasSentToken ?
              <Fragment>
                <h2>{_("Nouveau mot de passe")}</h2>
                <ErrorMessage message={ this.state.errorMessage }/>
                <Form ref={ this.newPassordForm } 
                      name="newPassordForm"
                      onSubmit={ this.updatePassword }>

                  <label htmlFor="password">{_("Mot de passe")}</label>
                  <Input name="password"
                        id="password" 
                        type="password" 
                        placeholder=""
                        required={true}
                        value={this.state.password} 
                        onChange={ this.onInputChange }/>

                  <label htmlFor="cpassword">{_("Confirmer mot de passe")}</label>
                  <Input name="cpassword"
                        id="cpassword" 
                        type="password" 
                        placeholder=""
                        required={true}
                        value={this.state.cpassword} 
                        onChange={ this.onInputChange }/>

                  <PrimaryButton name="sendTokenBtn"
                                id="sendTokenBtn"
                                type="submit"
                                loading={ this.state.loading }>
                    {_("Enregistrer")}
                  </PrimaryButton>
                </Form>
              </Fragment>
            :
            <Fragment>
              <img className="success-icon" alt="succes" src={successCheck}/>
              <h2>{_("Mot de pass modifié")}</h2>
              <TextSecondary>
                {_("Votre mot de passe à été modifié avec succes")}. <Link to="/login">
                <TextButton>{_("Connectez-vous")}</TextButton>
                </Link> {_("avec votre nouveau mot de passe")}.
              </TextSecondary>
            </Fragment>
             }
            
          </div>
        </section>
      </div>
    )
  }
}

export default NewPassword;
