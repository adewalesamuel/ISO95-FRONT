import React from 'react';
import hide from './../assets/icons/hide.svg'
import view from './../assets/icons/view.svg'

function Input(props) {
  return (
    <div className="form-control">
    	<input name={ props.name } 
			     id={ props.id }
			     type={ props.type }
			     placeholder={ props.placeholder }
           required={ props.required }
			     value={ props.value } 
           pattern={props.pattern && props.pattern}
           title={props.title && props.title}
			     onChange={ props.onChange }/>
    </div>
  )
}

export function TextArea(props) {
  return (
    <div className="form-control">
      <textarea name={ props.name } 
               id={ props.id }
               type='text' 
               placeholder={ props.placeholder }
               required={ props.required }
               onKeyPress={ props.onKeyPress && props.onKeyPress }
               onChange={ props.onChange }
               value={props.value }>
      </textarea>
    </div>
  )
}

export class PasswordInput extends React.Component {
  constructor(props) {
    super(props)
    this.changeHiddenState = this.changeHiddenState.bind(this)
    this.state = {
        hidden: true
    }
  }

  changeHiddenState() {
    this.setState( (state, props) => ({
        hidden: !state.hidden
    }))
  }

  render() {
    return (
      <div className="form-control">
        <input name={ this.props.name } 
          id={ this.props.id }
          type={ this.state.hidden ? 'password' : 'text' } 
          placeholder={ this.props.placeholder }
          required={ this.props.required }
          value={ this.props.value } 
          minLength={6}
          onChange={ this.props.onChange }/>
        <img className="input-icon" 
          alt=""
          src={ this.state.hidden ? view : hide } 
          width="20px" 
          onClick={ this.changeHiddenState } />   
      </div>
    )
  }
}

export default Input;
