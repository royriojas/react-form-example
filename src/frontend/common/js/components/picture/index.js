import React, { Component, PropTypes } from 'react';
import sheet from './picture.m.less';
import trim from 'jq-trim';
import createLoaderSign from '../../helpers/loader-sign/index.js';
import prepend from '../../helpers/prepend';
import dom from 'dom-event-special';

export default class Picture extends Component {
  constructor( props ) {
    super( props );
    this.state = { loadState: 'idle' };
  }

  static propTypes = {
    imgSrc: PropTypes.string,
    className: PropTypes.string
  }

  componentDidMount() {
    const {imgSrc} = this.props;
    const loader = this.loader = createLoaderSign();
    const picture = this.refs.picture;

    loader.appendTo( picture );
    loader.show();

    const img = new Image();

    img.src = imgSrc;

    const me = this;

    dom.on( img, 'load.picture', () => {
      prepend( img, picture );
      me.setState( { loadState: 'success' } );
    } );

    dom.on( img, 'error.picture', () => me.setState( { loadState: 'fail' } ) );
    dom.on( img, 'load.picture error.picture', () => {
      loader.hide();
      dom.off( img, '.picture' );
    } );
  }

  componetWillUnmount() {
    this.loader = null;
  }

  render() {
    const {loadState} = this.state;
    const {className} = this.props;

    const cNames = trim( sheet.t( 'picture' ) + ` ${ trim( className )}` );

    return <div ref="picture"
                className={ cNames }
                data-load-state={ loadState }>
           </div>;
  }
}
