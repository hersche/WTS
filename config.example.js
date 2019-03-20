module.exports = {
  serverPort:8001, /* The port for nginx or apache */
  rootUrl:'https://wts.url/', /* http://127.0.0.1:8001 for dev */
  cookieKey:'lulSec(cause@GIT)', /* Choose another key here */
  uploadLimitSize: 1000, /* In Mb */
  db:{
    dialect:"sqlite", /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' | 'sqlite' */
    path:"./wts.db", /* only for sqlite */
    // the rest of the db-options is valid for all db's except sqlite
    dbname:"wts",
    user:"wtsuser",
    password:"smth1ngC0mpl1c4t3d",
    host:"localhost"
  },
  /* It's reconized that some urls are redundant - however, it's the simplest and most-freely config-way for now */
  oauth2:{
    rootURL:'https://laratube.url/', /* http://127.0.0.1:8000 for dev */
    authorizationURL: 'https://laratube.url/oauth/authorize',
    tokenURL: 'https://laratube.url/oauth/token',
    clientID: "4", /* ID and Secret can be generated with any user in LaraTube (Debug->Oauth->Clients). */
    clientSecret: "2CFrG0D5SFhDeW1Fh43jJN2U7uiUE6wHEpzgYmvH",
    callbackURL: "https://wts.url/api/auth/callback" /* Its important to use the same callback-url for the Oauth-Client in LaraTube */
  }
}