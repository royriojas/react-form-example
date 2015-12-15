import React, { Component } from 'react';
import styles from './status.m.less';

export default class LoaderBar extends Component {
  render() {
    let {extraClass = '', processState, successMessage, errorMessage} = this.props;
    let bars;
    if ( processState === 'processing' ) {
      bars = <div className={ styles.t( 'wrapper' ) }>
               <div className={ styles.t( 'square' ) }></div>
               <div className={ styles.t( 'square' ) }></div>
               <div className={ styles.t( 'square' ) }></div>
               <div className={ styles.t( 'square' ) }></div>
               <div className={ styles.t( 'square' ) }></div>
             </div>;
    }
    if ( processState === 'success' ) {
      bars = <div className={ styles.t( 'wrapper' ) }>
               { successMessage ? <div className={ styles.t( 'message' ) }>
                                    <p>
                                      { successMessage }
                                    </p>
                                  </div> : null }
               <div className={ styles.t( 'success' ) }></div>
             </div>;
    }
    if ( processState === 'failure' ) {
      bars = <div className={ styles.t( 'wrapper' ) }>
               { errorMessage ? <div className={ styles.t( 'message' ) }>
                                  <p>
                                    { errorMessage }
                                  </p>
                                </div> : null }
               <div className={ styles.t( 'failure' ) }></div>
             </div>;
    }
    return <div className={ styles.t( 'loader-bar' ) + ` ${extraClass}` }>
             { bars }
           </div>;
  }
}
