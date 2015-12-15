import React, { Component } from 'react';
import sheet from './text-field.m.less';
import Field from '../field/field';
import trim from 'jq-trim';
import clsc from 'coalescy';

import cx from 'classnames';
import TextEntry from '../text-entry/text-entry.js';

export default class TextField extends Component {
  constructor() {
    super();
    this.state = { };
  }

  handleBlur() {
    const {field, onBlur} = this.props;

    if ( field && field.validator.execOnBlur ) {
      field.validator.fn();
    }

    if ( onBlur ) {
      onBlur();
    }
  }

  static defaultProps = {
    //validatingText: '',
    //validatorSuccessText: ''
  }

  render() {
    /*esfmt-ignore-start*/
    let {
      valid,
      validating,
      validatingText,
      validatorErrorText,
      validatorSuccessText,
      iconClass,
      textEntryExtraClass,
      placeholder,
      type,
      onEnterPress,
      onBlur,
      value,
      label,
      field,
      onValueChanged
    } = this.props;
    /*esfmt-ignore-end*/

    if ( field ) {
      const validator = field.validator;

      valid = clsc( valid, validator.isValid() ); // TODO: change this to be an accessor
      validating = clsc( validating, validator.validating );
      validatingText = clsc( validatingText, validator.validatingMessage );
      validatorErrorText = clsc( validatorErrorText, validator.errorMessage );
      validatorSuccessText = clsc( validatorSuccessText, validator.successMessage );
      value = clsc( value, field.value );
      onBlur = this.handleBlur.bind( this );
    }

    const invalid = !valid;

    let success = !invalid && !validating && trim( validatorSuccessText ) !== '';

    let validatorClasses = cx( { validator: true, on: invalid } );

    return <Field label={ label }>
             <div>
               <TextEntry invalid={ invalid }
                          iconClass={ iconClass }
                          extraClass={ textEntryExtraClass }
                          type={ type }
                          placeholder={ placeholder }
                          onEnterPress={ onEnterPress }
                          onBlur={ onBlur }
                          value={ value }
                          onValueChanged={ onValueChanged } />
             </div>
             { validating ? <p className={ sheet.t( 'validating' ) }>
                              <span>{ validatingText }</span>
                            </p> : null }
             <p className={ sheet.t( validatorClasses ) }>
               <span>{ validatorErrorText }</span>
             </p>
             { success ? <p className={ sheet.t( 'valid-message' ) }>
                           { validatorSuccessText }
                         </p> : null }
           </Field>;
  }
}
