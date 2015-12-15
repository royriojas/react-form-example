import React, { Component } from 'react';
import TextField from '../../components/text-field/text-field';
import Button from '../../components/button/button';
import Form from '../../components/form/form';
import trim from 'jq-trim';

// we just need to import it to have the tap definition
import '../../events/tap';

import formSheet from '../../components/form/form.m.less';
import sheet from './register.m.less';

import formModel from '../../form-model';

export default class Register extends Component {
  constructor( props ) {
    super( props );
    const me = this;
    const model = this.model = formModel.create( {
      name: '',
      email: '',
      password: ''
    }, {
      name: {
        execOnBlur: true,
        validatingMessage: 'Checking availability...',
        successMessage: '✓',
        fn( field, resolve, reject ) {
          if ( !trim( field.value ) ) {
            return reject( { error: 'Please provide a name' } );
          }

          me.props.checkUniqueUsername( { username: field.value } ).then(
            resolve,
            () => reject( { error: 'Username already in use' } )
          );
        }
      },
      email: {
        execOnBlur: true,
        validatingMessage: 'Checking email...',
        successMessage: '✓',
        fn( field, resolve, reject ) {
          const email = trim( field.value );
          if ( !email || !(email.indexOf( '@' ) > 0) ) { // super simple email validation...
            return reject( { error: 'Please provide a valid email' } );
          }

          const p = me.props.checkUniqueEmail( { email: email } );

          p.then(
            resolve,
            () => reject( { error: 'Email already in use' } )
          );
        }
      },
      password( field, resolve, reject ) {
        if ( !field.value ) {
          return reject( { error: 'Please provide your password' } );
        }
        resolve();
      }
    } );

    this.state = { fields: model.fields, processError: null };
  }

  onValueChanged( key, args ) {
    if ( trim( this.state.processState ) ) {
      this.setState( { processState: '', processError: '' } );
    }
    this.model.setFormState( { forceValidation: false } );
    this.model.setFieldData( key, { value: args.value } );
  }

  componentDidMount() {
    const me = this;
    this.model.on( 'data:change.form', () => {
      me.setState( { fields: me.model.fields } );
    } );
  }

  componentWillUnmount() {
    this.model.off( '.form' );
  }

  handleRegister() {

    const {onSubmit} = this.props;
    const {fields} = this.state;

    this.setState( { processError: '' } );

    this.model.validate().then( () => {
      this.setState( { processState: 'processing' } );

      const p = onSubmit( {
        username: fields.name.value,
        password: fields.password.value,
        email: fields.email.value
      } );

      p.then( (args) => {
        this.setState( { processState: 'success' } );
        this.props.onSuccess && this.props.onSuccess( args );
      }, (args) => {
        this.setState( { processError: args.token, processState: 'failure' } );
      } );

    } );
  }

  render() {
    /*esfmt-ignore-start*/
    const {
      fields,
      processError,
      processState
    } = this.state;

    /*esfmt-ignore-end*/
    const txtClass = formSheet.t( 'l-text-entry' );

    return <Form processState={ processState }
                 processError={ processError }
                 title="Register">
             <TextField label="Username"
                        iconClass="xfa-user"
                        field={ fields.name }
                        placeholder="John Doe"
                        textEntryExtraClass={ txtClass }
                        onValueChanged={ this.onValueChanged.bind( this, 'name' ) } />
             <TextField label="Email"
                        iconClass="xfa-envelope-o"
                        field={ fields.email }
                        placeholder="user@threadweather.io"
                        textEntryExtraClass={ txtClass }
                        onValueChanged={ this.onValueChanged.bind( this, 'email' ) } />
             <TextField label="Password"
                        iconClass="xfa-key"
                        field={ fields.password }
                        type="password"
                        placeholder="type your password here"
                        textEntryExtraClass={ txtClass }
                        onEnterPress={ ::this.handleRegister }
                        onValueChanged={ this.onValueChanged.bind( this, 'password' ) } />
             <div className={ formSheet.t( 'button-field' ) }>
               <Button label={ processState !== 'processing' ? 'Register' : 'Processing...' }
                       onTap={ ::this.handleRegister }
                       valid={ this.model.isFormValid() }
                       disabled={ processState === 'processing' || processState === 'success' } />
             </div>
             <div className={ sheet.t( 'already-registered' ) }>
               <p>
                 Already registered? &nbsp; <a className="lnk" href="/login">Sign In</a>
               </p>
             </div>
           </Form>;
  }
}
