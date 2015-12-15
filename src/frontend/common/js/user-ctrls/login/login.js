import React, { Component } from 'react';
import TextField from '../../components/text-field/text-field';
import Button from '../../components/button/button';
import Form from '../../components/form/form';

// we just need to import it to have the tap definition
import '../../events/tap';

import formSheet from '../../components/form/form.m.less';
import sheet from './login.m.less';
import formModel from '../../form-model';
import trim from 'jq-trim';

export default class Login extends Component {
  constructor( props ) {
    super( props );

    const model = this.model = formModel.create( { name: '', password: '' }, {
      name( field, resolve, reject ) {
        if ( !trim( field.value ) ) {
          return reject( { error: 'Please provide your name' } );
        }
        resolve();
      },
      password( field, resolve, reject ) {
        if ( !trim( field.value ) ) {
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

  handleLogin() {

    const {onSubmit} = this.props;
    const {fields} = this.state;

    this.setState( { processError: '' } );

    this.model.validate().then( () => {
      this.setState( { processState: 'processing' } );
      const p = onSubmit( { username: fields.name.value, password: fields.password.value } );

      p.then( (args) => {
        this.setState( { processState: 'success' } );
        this.props.onSuccess && this.props.onSuccess( args );
      }, (args) => {
        this.setState( { processError: args.token, processState: 'failure' } );
      } );

    } );
  }

  render() {
    /* esfmt-ignore-start */
    const {
      fields,
      processState,
      processError
    } = this.state;
    /* esfmt-ignore-end*/

    const txtClass = formSheet.t( 'l-text-entry' );

    return <Form processState={ processState }
                 processError={ processError }
                 title="Sign In">
             <TextField label="Username"
                        iconClass="xfa-user"
                        field={ fields.name }
                        placeholder="user@threadweather.io"
                        textEntryExtraClass={ txtClass }
                        onValueChanged={ this.onValueChanged.bind( this, 'name' ) } />
             <TextField label="Password"
                        iconClass="xfa-key"
                        field={ fields.password }
                        type="password"
                        placeholder="type your password here"
                        textEntryExtraClass={ txtClass }
                        onEnterPress={ ::this.handleLogin }
                        onValueChanged={ this.onValueChanged.bind( this, 'password' ) } />
             <div className={ formSheet.t( 'button-field' ) }>
               <Button label={ processState !== 'processing' ? 'Sign in' : 'Processing...' }
                       onTap={ ::this.handleLogin }
                       valid={ this.model.isFormValid() }
                       disabled={ processState === 'processing' || processState === 'success' } />
             </div>
             <div className={ sheet.t( 'new-to-us' ) }>
               <p>
                 New to us? &nbsp; <a className="lnk" href="/register">Sign Up</a>
               </p>
               <p>
                 <a className="lnk" href="/password/forgot">Forgot password?</a>
               </p>
             </div>
           </Form>;
  }
}
