import React, { Component } from 'react';
import query from 'dom-query';

import FormTitle from '../form-title/form-title';
import StatusMessage from '../status-message/status-message';

import formSheet from './form.m.less';

const PropTypes = React.PropTypes;

export default class Form extends Component {
  constructor( props ) {
    super( props );
  }

  static propTypes = {
    initialTabIndex: PropTypes.number,
    title: PropTypes.string
  }

  static defaultProps = {
    initialTabIndex: 1
  }

  componentDidMount() {
    const ele = this.refs.form;
    const tabElements = query.all( 'input, a, button', ele );
    let tabIndexCount = this.props.initialTabIndex;

    tabElements.forEach( (element) => element.setAttribute( 'tabindex', tabIndexCount++ ) );
  }

  render() {
    const {extraClass, title, processState, processError} = this.props;
    let formClass = formSheet.t( 'form' );

    if ( extraClass ) {
      formClass += ` ${extraClass}`;
    }

    return <div ref="form" className={ formClass }>
             <FormTitle label={ title } />
             { this.props.children }
             <StatusMessage extraClass={ formSheet.t( 'loader-bar' ) }
                            processState={ processState }
                            errorMessage={ processError } />
           </div>;
  }
}
