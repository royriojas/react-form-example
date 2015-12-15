import React, { Component } from 'react';
import sheet from './field.m.less';

export default class Field extends Component {
  render() {
    let {label, extraClass} = this.props;

    const labelC = label ? <label>
                             { label }
                           </label> : null;

    extraClass = extraClass ? ' ' + extraClass : '';

    return <div className={ sheet.t( 'field' ) + ` ${extraClass}` }>
             { labelC }
             { this.props.children }
           </div>;
  }
}
