
const vueRenderer = require('@doweb/vuexpress').vueRenderer;
const express = require('express');

const axios = require('axios')
var config = require('./config');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
require('http').globalAgent.options.rejectUnauthorized = false;
require('https').globalAgent.options.rejectUnauthorized = false;
const app = express();
const session = require('express-session');

app.use(session({
  secret: 'lulSec(cause@GIT)',
  cookie: {}
}));


app.use(morgan('combined'));
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./wts.db');
var ui = 0
const passport = require('passport'), OAuth2Strategy = require('passport-oauth2')
app.use(passport.initialize());
app.use(passport.session());
passport.use(new OAuth2Strategy(config.oauth2,
  function(accessToken, refreshToken, profile, cb) {
    console.log("LOGIN WITH",profile)
    console.log("ACCESS TOKEN LOGIN WITH",accessToken)
    console.log("REFRESH TOKEN LOGIN WITH",refreshToken)
    //User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      ui++
      if(accessToken!=''){
        axios.defaults.headers.common = {'Authorization': 'Bearer '+accessToken}
      var aconfig = {
    headers: {'Authorization': 'bearer ' + accessToken}
};

var bodyParameters = {
   uid: 1
}
console.log("OAUTH-GEEEEET general")

axios.get( 
  config.oauth2.rootURL+'api/user',
  bodyParameters,
  aconfig
).then((response) => {
  console.log("OAUTH-GEEEEET response")
  console.log(response)
  passport.serializeUser(function(user, done) {
  done(null, user);
  });
passport.deserializeUser(function(user, done) {
  done(null, user);
});
  return cb(false, response.data);
}).catch((error) => {
  console.log("CATCH USER-REQUES")
  console.log(error)
  return cb(false, false);
});
} else {
  return cb(false, false);
}
      
    //});
  }
));
const { ensureLoggedIn } = require('connect-ensure-login');
app.get('/logintest',
  ensureLoggedIn('/login'),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("login-test-success")
    console.log(req.user)
    res.redirect('/?');
  });
  app.get('/logout',
    ensureLoggedIn('/login'),
    function(req, res) {
      // Successful authentication, redirect home.
      req.logout()
      res.redirect('/?LOGOUT');
    });
  app.get('/auth/callback',
  passport.authenticate('oauth2', { failureRedirect: '/?NOSUCCESS' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  
  app.get('/upload',
    ensureLoggedIn('/login'),
    function(req, res) {
      res.render('upload', { myVar1: 'my variable one' }, { plain: true, inlineCSS: false });
    });
app.get('/login',
  passport.authenticate('oauth2'));
/*
OAuth2Strategy.prototype.authenticate = function(req, options) {
  // ...
  
  if (req.query && req.query.error) {
    // fail authentication sequence
    console.log("FAIL AUTH")
  }

  if (req.query && req.query.code) {
    // process the callback from the identity provider
    console.log("PROCESS CALLBACK")
  } else {
    // start the authentication sequence
    console.log("START AUTH (last step?)")
  }
};
*/
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024* 1024 },
}));
const mainRoute = require('./router');
app.use(bodyParser.json());
let options = {
    // folder with your views
    views: './views',
    // cache templates
    cache: false,
    // use watch = true only in dev mode! Will start webpack watcher only on the current request.
    watch: false,
    // meta info - check out https://github.com/ktquez/vue-head for more information
    metaInfo: {
      title: 'Default Title'
    },
    // extract css to file, otherwise it will be inline
    extractCSS: true,
    // css output folder, extracted styles from your *.vue files
    cssOutputPath: 'css/style.css',
    // path to your web root
    publicPath: './public',
    // global vars, access directly like window.
    globals: {
        example: 'world!'
    },
    plugins: [
        // vue plugins
        // require('your-plugin')
    ],
    compilerConfig: {
        // custom webpack config
    },
    compilerConfigCallback: function(webpackConfig) {
        // change the merged webpackconfig if you like
        return webpackConfig;
    },
    onError: (err) => {}, // error handler
    onReady: () => {} // ready event handler, when completed the work of initialization
};

const renderer = vueRenderer(options);
app.use(renderer);

app.use('/', mainRoute);

app.listen(8001, () => {

  console.log('Server started!');
});