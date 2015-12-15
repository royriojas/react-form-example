import sheet from './loader-sign.m.less';
import $ from 'jQuery';
import { Promise } from 'es6-promise';
import playAnimation from 'play-animation';

export default function createLoaderSign() {
  const $ele = $( `<div class="${ sheet.t( 'loader' )}">
      <span class="${ sheet.t( 'affordance' )}"></span>
    </div>` );

  return {
    appendTo( ele ) {
      $ele.appendTo( ele );
    },
    show() {
      if ( this.showingPromise ) {
        return this.showingPromise;
      }
      $ele.addClass( 'on' );
      this.showingPromise = new Promise( (resolve) => {
        playAnimation( $ele, 'enter', () => {
          this.showingPromise = null;
          resolve();
        } );
      } );
      return this.showingPromise;
    },
    hide() {
      const p = this.showingPromise || Promise.resolve();
      p.then( () => {
        playAnimation( $ele, 'exit', () => {
          $ele.removeClass( 'on' );
          $ele.remove();
        } );
      } );
    }
  };
}
