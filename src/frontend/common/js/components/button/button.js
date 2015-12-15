import React, { Component } from 'react';
import styles from './button.m.less';
import dom from 'dom-event-special';
import cx from 'classnames';
import trim from 'jq-trim';
import 'eveui/quicktips';

// we just need to import it to have the tap definition
import '../../events/tap';

export default class Button extends Component {
  componentDidMount() {
    const ele = this.refs.btn;

    if ( !this.props.onTap ) {
      return;
    }
    dom.on( ele, 'tap.button', this.props.onTap );
    dom.on( ele, 'keyup.button', (e) => {
      if ( e.keyCode === 13 ) {
        this.props.onTap();
      }
    } );
  }

  componetWillUnmount() {
    dom.off( this.refs.btn, '.button' );
  }

  render() {
    const {type, valid, className, tooltip} = this.props;

    let cNames = cx( {
      'button': true,
      'primary': type === 'primary',
      'secondary': type === 'secondary',
      'cautionary': type === 'cautionary',
      'invalid': valid === false
    } );

    cNames = styles.t( cNames );

    cNames += ` ${ trim( className )}`;
    cNames = trim( cNames );

    const children = this.props.children || <span className={ styles.t( 'label' ) }>{ this.props.label }</span>;

    return <button ref="btn"
                   data-tooltip={ tooltip }
                   className={ cNames }
                   disabled={ this.props.disabled }>
             { children }
           </button>;
  }
}
