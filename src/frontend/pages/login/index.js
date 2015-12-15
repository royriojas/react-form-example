import '../../common/js/common';
import React from 'react';
import ReactDom from 'react-dom';
import doc from 'document';

import Login from '../../common/js/user-ctrls/login/login';
import service from '../../common/js/services/service';

const page = {
  handleSuccess( {data} ) {
    if ( data.redirect ) {
      doc.location.href = data.redirect; // TODO: use a redirector module
    }
  },

  init() {
    this.render();
  },
  render() {
    ReactDom.render( <Login onSubmit={ service.doLogin.bind( service ) } onSuccess={ ::this.handleSuccess } />
      , doc.querySelector( '#login-section' ) );
  }
};

page.init();

export default page;
