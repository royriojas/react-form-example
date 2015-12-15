import '../../common/js/common';
import React from 'react';
import ReactDom from 'react-dom';
import doc from 'document';

import ForgotPassword from '../../common/js/user-ctrls/forgot-password/index';
import service from '../../common/js/services/service';
import win from 'window';

const page = {
  handleSuccess() {
    // todo: make alert after success
    win.alert( 'an email was sent to you' );
  // if ( data.redirect ) {
  // doc.location.href = data.redirect; // TODO: use a redirector module
  // }
  },

  init() {
    this.render();
  },
  render() {
    ReactDom.render( <ForgotPassword onSubmit={ service.forgotPassword.bind( service ) } onSuccess={ ::this.handleSuccess } />
      , doc.querySelector( '#forgot-password-section' ) );
  }
};

page.init();

export default page;
