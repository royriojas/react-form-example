import touchy from '../touchy.js';
import dom from 'dom-event-special';
import closest from 'component-closest';

function setupPreventDefaultOnButton() {
  dom.on( document, 'click.tap-preventing', 'button, a.button, [data-pd]', e => e.preventDefault() );
}

function cancelPreventDefault() {
  dom.off( '.tap-preventing' );
}

let count = 0;

dom.register( 'tap', {
  setup() {
    count++;
    if ( count === 1 ) {
      touchy._opts.tap = true;
      setupPreventDefaultOnButton();
    }
  },
  add( descriptor ) {
    const oldHandler = descriptor.callback;

    descriptor.callback = (e) => {
      if ( closest( e.target, '[disabled]', this ) ) {
        return;
      }
      oldHandler && oldHandler.apply( this, arguments );
    };
  },

  teardown() {
    count--;
    if ( count === 0 ) {
      touchy._opts.tap = false;
      cancelPreventDefault();
    }
  }
} );
