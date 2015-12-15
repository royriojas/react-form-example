import React, { Component } from 'react';
import sheet from './form-title.m.less';

export default class Button extends Component {
  render() {
    return <div className={ sheet.t( 'form-title' ) }>
             <h2><span>{ this.props.label }</span></h2>
           </div>;
  }
}
