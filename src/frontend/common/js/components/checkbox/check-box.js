import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import styles from './check-box.m.less';
import dom from 'dom-event-special';
import cx from 'classnames';

// we just need to import it to have the tap definition
import tap from '../events/tap'; // eslint-disable-line

export default class CheckBox extends Component {
  handleChange() {
    this.props.onChange && this.props.onChange( { value: !this.props.value } );
  }

  componentDidMount() {
    const ele = findDOMNode( this );
    dom.on( ele, 'tap', this.handleChange.bind( this ) );

    dom.on( ele, 'keydown', (e) => {
      if ( e.keyCode === 13 ) {
        this.handleChange();
      }
    } );
  }

  render() {
    const {tabIndex} = this.props;
    const chkClassName = cx( { 'check-box': true, 'checked': this.props.value } );

    return <a tabIndex={ tabIndex } className={ styles.t( chkClassName ) }><span className={ styles.t( 'wrapper' ) }><span className={ styles.t( 'icon' ) }></span> <span className={ styles.t( 'label' ) }>{ this.props.label }</span></span></a>;
  }
}
