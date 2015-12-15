import React, { Component } from 'react';
import TextField from '../../components/text-field/text-field';
import Button from '../../components/button/button';
import Form from '../../components/form/form';

// we just need to import it to have the tap definition
import '../../events/tap';

import formSheet from '../../components/form/form.m.less';
import fpSheet from './index.m.less';
import formModel from '../../form-model';
import trim from 'jq-trim';

export default class ForgotPassword extends Component {
  constructor( props ) {
    super( props );

    const model = this.model = formModel.create( { email: '' }, {
      email( field, resolve, reject ) {
        const email = trim( field.value );
        if ( !email || !(email.indexOf( '@' ) > 0) ) { // super simple email validation...
          return reject( { error: 'Please provide a valid email' } );
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

  handleSuccess() {

    const {onSubmit} = this.props;
    const {fields} = this.state;

    this.setState( { processError: '' } );

    this.model.validate().then( () => {
      this.setState( { processState: 'processing' } );
      const p = onSubmit( { email: fields.email.value } );

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
                 title="Forgot Password?">
             <TextField label="Email"
                        iconClass="xfa-envelope-o"
                        field={ fields.email }
                        placeholder="user@threadweather.io"
                        textEntryExtraClass={ txtClass }
                        onEnterPress={ ::this.handleSuccess }
                        onValueChanged={ this.onValueChanged.bind( this, 'email' ) } />
             <div className={ formSheet.t( 'button-field' ) }>
               <Button label={ processState !== 'processing' ? 'Send' : 'Processing...' }
                       onTap={ ::this.handleSuccess }
                       valid={ this.model.isFormValid() }
                       disabled={ processState === 'processing' || processState === 'success' } />
             </div>
             <div className={ fpSheet.t( 'nav-btns' ) }>
               <p>
                 Remebered your password?
               </p>
               <p>
                 Go back to <a className="lnk" href="/login">Sign In</a>.
               </p>
             </div>
           </Form>;
  }
}
