import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './text-entry.m.less';
import trim from 'jq-trim';
import dom from 'dom-event-special';
import cx from 'classnames';

// we just need to import it to have the tap definition
import tap from '../../events/tap'; // eslint-disable-line

export default class TextEntry extends Component {

  clearText() {
    this.refs.txt.value = '';
    const args = { value: '' };
    this.raiseChange( args );
    this.refs.txt.focus();
  }

  raiseChange( args ) {
    this.props.onValueChanged && this.props.onValueChanged( args );
  }

  handleChange( e ) {
    const args = { value: e.target.value };
    this.raiseChange( args );
  }

  componentDidMount() {
    const ele = findDOMNode( this );
    dom.on( ele, 'tap', `.${ styles.t( 'clear-icon' )}`, this.clearText.bind( this ) );
    if ( !this.props.onEnterPress ) {
      return;
    }
    dom.on( ele, 'keydown', ({keyCode}) => {
      if ( keyCode === 13 ) {
        this.props.onEnterPress();
      }
    } );
  }

  static defaultProps = {
    disabled: false,
    value: '',
    placeholder: '',
    invalid: false,
    type: 'text'
  }

  handleFocus() {
    this.setState( { focused: true } );
  }

  handleBlur() {
    setTimeout( () => {
      this.setState( { focused: false } );
    }, 100 );

    this.props.onBlur && this.props.onBlur();
  }

  render() {
    let {iconClass, type} = this.props;
    iconClass = trim( iconClass );

    let txtIco;
    let icon;
    let state = this.state || { };
    let focused = state.focused;
    let hasContent = this.props.value !== '';
    let showClearIcon = (focused || hasContent);

    if ( iconClass ) {
      txtIco = `${ styles.t( 'txt-icon' )} ${iconClass}`;
      icon = <div className={ txtIco }></div>;
    }

    let outerStyles = cx( {
      'chrome': true,
      'disabled': this.props.disabled,
      'focused': state.focused,
      'invalid': this.props.invalid
    } );

    return <div className={ styles.t( outerStyles ) + ' ' + (this.props.extraClass || '') }>
             <div className={ styles.t( 'wrapper' ) }>
               { icon }
               <input ref="txt"
                      className={ styles.t( 'textentry', iconClass ? 'icon-visible' : undefined ) }
                      placeholder={ this.props.placeholder }
                      disabled={ this.props.disabled }
                      defaultValue={ this.props.value }
                      type={ type }
                      onBlur={ ::this.handleBlur }
                      onFocus={ ::this.handleFocus }
                      onChange={ ::this.handleChange } />
               <div className={ styles.t( 'clear-icon' ) + (showClearIcon ? ` ${ styles.t( 'on' )}` : '') }></div>
             </div>
           </div>;
  }
}
