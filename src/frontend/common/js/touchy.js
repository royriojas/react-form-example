module.exports = require( 'touchy' ).enableOn( document, {
  tap: true,
  swipe: false,
  taphold: true,
  tapHoldMinThreshold: 220,
  discardTapholdIfMove: false
} );
