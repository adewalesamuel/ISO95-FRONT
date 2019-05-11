import React from 'react';
import './../css/form.css';

const Form = React.forwardRef( (props, ref) => (
  <form name={ props.name }
        ref={ref} 
        onSubmit={ props.onSubmit } > 
  { props.children } 
  </form>
) )

export default Form;
