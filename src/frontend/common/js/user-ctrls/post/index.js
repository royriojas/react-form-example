import React, { Component, PropTypes } from 'react';
import Button from '../../components/button/button';
import Picture from '../../components/picture';
import trim from 'jq-trim';
import 'eveui/quicktips';

import sheet from './post.m.less';

export default class Post extends Component {

  static propTypes = {
    post: PropTypes.object,
    className: PropTypes.string
  }

  handleAction( action ) {
    const {onAction, post} = this.props;
    onAction && onAction( action, post );
  }

  render() {
    const {post, className} = this.props;

    const cName = trim( sheet.t( 'post' ) + ` ${ trim( className )}` );

    return <div className={ cName }>
             <Picture imgSrc={ post.imgSrc } className={ sheet.t( 'picture' ) } />
             <div className={ sheet.t( 'buttons' ) }>
               <Button tooltip="Edit"
                       onTap={ this.handleAction.bind( 'edit' ) }
                       className={ sheet.t( 'transparent' ) }>
                 <span className="xfa-edit"></span>
               </Button>
               <Button tooltip="Delete"
                       onTap={ this.handleAction.bind( 'delete' ) }
                       className={ sheet.t( 'transparent cautionary' ) }>
                 <span className="xfa-trash"></span>
               </Button>
             </div>
           </div>;
  }
}
