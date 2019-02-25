
const vueRenderer = require('@doweb/vuexpress').vueRenderer;
const express = require('express');
var config = require('./config');
const fileUpload = require('express-fileupload');
const morgan = require('morgan');
require('http').globalAgent.options.rejectUnauthorized = false;
require('https').globalAgent.options.rejectUnauthorized = false;
const app = express();
app.use(morgan('combined'));
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./wts.db');
const passport = require('passport'), OAuth2Strategy = require('passport-oauth2')
app.use(passport.initialize());
app.use(passport.session());
passport.use(new OAuth2Strategy(config.oauth2,
  function(accessToken, refreshToken, profile, cb) {
    //User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      //return cb(err, user);
    //});
  }
));
app.get('/logintest',
  passport.authorize('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log("login-test-success")
    res.redirect('/');
  });
app.get('/auth/callback',
  passport.authorize('oauth2', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  
  app.get('/upload',
    passport.authorize('oauth2', { failureRedirect: '/login' }),
    function(req, res) {
      res.render('upload', { myVar1: 'my variable one' }, { plain: true, inlineCSS: false });
    });
app.get('/login',
  passport.authenticate('oauth2'));

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