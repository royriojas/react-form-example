import 'shim-console';
import 'dtektor/all';
import 'browser-detector';

import 'custom-events/window-resize';
import $ from 'jQuery';
import win from 'window';

const $pageSection = $( '.page-section, .spa-section' );
const $win = $( win );

const $header = $( '.container header' );
const $footer = $( '.container footer' );

function checkSize() {
  const height = $( win ).height() - ($header.outerHeight() + $footer.outerHeight());
  $pageSection.css( 'min-height', height );
}

$win.on( 'window:resize', checkSize );
checkSize();
