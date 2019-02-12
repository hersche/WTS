
const vueRenderer = require('@doweb/vuexpress').vueRenderer;
const express = require('express');

const fileUpload = require('express-fileupload');
const morgan = require('morgan');


const app = express();
app.use(morgan('combined'));
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./wts.db');

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