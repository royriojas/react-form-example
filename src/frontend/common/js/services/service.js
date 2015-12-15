import serviceFactory from 'xhr-service-creator';

const service = serviceFactory.createFromDescriptor( {
  doLogin: {
    xhrOpts: {
      // params: username, password
      url: '/api/account/login',
      type: 'POST'
    }
  },
  doRegister: {
    xhrOpts: {
      // params: username, email, password
      url: '/api/account/register',
      type: 'POST'
    }
  },
  checkEmail: {
    cacheResponse: true,
    // params: email
    xhrOpts: {
      url: '/api/account/checkUniqueEmail',
      type: 'GET'
    }
  },
  checkUsername: {
    cacheResponse: true,
    // params: username
    xhrOpts: {
      url: '/api/account/checkUniqueUsername',
      type: 'GET'
    }
  },
  forgotPassword: {
    // params: email
    xhrOpts: {
      url: '/api/account/forgotPassword',
      type: 'POST'
    }
  },
  createPost: {
    // params: "arrayTags", "arrayWords", "caption", "comments", "countryCode", "geopoint", "links", "location", "promo", "stringTags", "tags", "text", "url1", "url2", "weather", "weatherInfo
    xhrOpts: {
      url: '/api/posts/single',
      type: 'POST'
    }
  }
} );

export default service;
