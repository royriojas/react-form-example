import { Promise } from 'es6-promise';
import dispatcher from 'dispatchy';
import clsc from 'coalescy';
import debounce from 'debouncy';
import extend from 'extend';

const formModel = {
  /**
   * create a model object that can inform of changes
   * to its fields. It receives two objects fields and validators for those fields
   * @param  {Object} fields     an object containing the field names as keys and its values
   * @param  {Object} validators an object containing the validators for the provided fields.
   * @return {Object} the model object that can be used on the react component
   */
  create( fields = { }, validators = { } ) {
    const model = {
      ...dispatcher,
      fields: {},
      validators: {},
      formState: {
        forceValidation: false,
        valid: null,
        validating: false
      },
      setFormState( data ) {
        this.formState = { ...this.formState, ...data };
        this._raiseChange();
      },
      isFormValid() {
        const formState = this.formState;
        if ( formState.validating || !formState.forceValidation ) {
          return true;
        }
        return formState.valid;
      },
      validate() {
        this.setFormState( {
          validating: true,
          valid: null, // we don't know if it will be valid or not
          forceValidation: true // assume true at the beginning of the validation
        } );

        const promises = Object.keys( this.fields ).map( (key) => this.fields[ key ].validator.fn() );
        const p = Promise.all( promises );

        p.then(
          () => this.setFormState( { valid: true, validating: false } ),
          () => this.setFormState( { validating: false, valid: false } )
        );
        return p;
      },
      _raiseChange() {
        this.fire( 'data:change' );
      },

      setFieldData( fieldName, data ) {
        const field = this.fields[ fieldName ];

        if ( !field ) {
          throw new Error( `field ${fieldName} not found` );
        }

        let interacted = field.interacted;
        const hasValueInData = 'value' in data;
        if ( hasValueInData ) {
          if ( !('validator' in data) ) {
            data.validator = {
              valid: null // reset the previous validation value
            };
          }
        }
        if ( !interacted ) {
          interacted = hasValueInData;
        }

        this.fields[ fieldName ] = extend( true, { }, field, { interacted }, data );
        this._raiseChange();
      }
    };

    Object.keys( fields ).reduce( (seq, key) => {
      const validatorDescriptor = validators[ key ] || { };

      let _vDescriptor = {
        errorMessage: '',
        successMessage: '',
        validatingMessage: '',
        execOnBlur: false,
        fn: (_field, resolve) => resolve()
      };

      if ( typeof validatorDescriptor === 'function' ) {
        _vDescriptor.fn = validatorDescriptor;
      } else {
        if ( typeof validatorDescriptor.fn === 'function' ) {
          _vDescriptor.fn = validatorDescriptor.fn;
        }
        _vDescriptor.execOnBlur = validatorDescriptor.execOnBlur;
        _vDescriptor.errorMessage = validatorDescriptor.errorMessage;
        _vDescriptor.successMessage = validatorDescriptor.successMessage;
        _vDescriptor.validatingMessage = validatorDescriptor.validatingMessage;
      }

      seq.fields[ key ] = {
        key: key,
        validator: {
          executed: false, // whether this validator was or not executed
          valid: null, // we don't know if valid or not at the beginning
          validating: false, // are we validating (async validation)
          errorMesssage: '', // what would the error message be
          execOnBlur: _vDescriptor.execOnBlur,
          isValid() {
            const field = model.fields[ key ];

            if ( this.validating || !this.executed ) {
              return true; // during validation assume it will be valid
            }

            if ( !model.formState.forceValidation && !field.interacted ) {
              return true;
            }

            if ( this.valid === null ) {
              return true; // when the field contents changes the value resets to null
            }

            return this.valid;
          },
          fn() {

            const doResolve = (message) => {
              model.setFieldData( key, {
                validator: {
                  errorMessage: '',
                  successMessage: clsc( message, _vDescriptor.successMessage ),
                  valid: true,
                  validating: false,
                  validatingMessage: ''
                }
              } );
            };

            model.setFieldData( key, {
              validator: {
                executed: true, // we know the validator was executed
                errorMessage: '', // we don't know if there will be an error message
                validating: true,
                validatingMessage: _vDescriptor.validatingMessage,
                valid: null // we don't know if valid
              }
            } ); // we assume validd at the beginning

            if ( !model.fields[ key ].interacted && !model.formState.forceValidation ) {
              doResolve( '' );
              return Promise.resolve();
            }

            const p = new Promise( (resolve, reject) => {
              // data mutates so that's why we need to seek for
              // the new field instead of use a reference here
              _vDescriptor.fn( model.fields[ key ], resolve, reject );
            } );

            p.then(
              ({message} = { }) => doResolve( message ),
              ({error} = { }) => {
                model.setFieldData( key, {
                  validator: {
                    successMessage: '',
                    errorMessage: clsc( error, _vDescriptor.errorMessage ),
                    valid: false,
                    validating: false,
                    validatingMessage: ''
                  }
                } );

              }
            );

            return p;
          }
        },
        interacted: false, // has the user interacted with the field or not
        value: fields[ key ] // the initial value of the field
      };

      return seq;
    }, model );

    model._raiseChange = debounce( model._raiseChange, 150, model );
    return model;
  }
};

export { formModel as default };
