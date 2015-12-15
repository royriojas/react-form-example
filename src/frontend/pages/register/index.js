import '../../common/js/common';
import React from 'react';
import ReactDom from 'react-dom';
import doc from 'document';
import Register from '../../common/js/user-ctrls/register/register';
import service from '../../common/js/services/service';

const page = {
  doRegister( args ) {
    return service.doRegister( args );
  },
  checkUniqueEmail( args ) {
    return service.checkEmail( args );
  },
  checkUniqueUsername( args ) {
    return service.checkUsername( args );
  },
  init() {
    this.render();
  },
  handleSuccess( {data} ) {
    if ( data.redirect ) {
      doc.location.href = data.redirect; // TODO: use a redirector module
    }
  },
  render() {
    ReactDom.render( <Register onSubmit={ ::this.doRegister }
                               checkUniqueUsername={ ::this.checkUniqueUsername }
                               checkUniqueEmail={ ::this.checkUniqueEmail }
                               onSuccess={ ::this.handleSuccess } />
      , doc.querySelector( '#register-section' ) );
  }
};

page.init();

export default page;
