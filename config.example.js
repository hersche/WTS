module.exports = {
  // Set your public viewable url here
  serverPort:8001,
  rootUrl:'http://127.0.0.1:8001/',
  cookieKey:'lulSec(cause@GIT)',
  db:{
    dialect:"sqlite",
    path:"./thewts.db"
  },
  oauth2:{
    rootURL:'http://127.0.0.1:8000/',
    authorizationURL: 'http://127.0.0.1:8000/oauth/authorize',
    tokenURL: 'https://127.0.0.1:8000/oauth/token',
    clientID: "4",
    clientSecret: "2CFrG0D5SFhDeW1Fh43jJN2U7uiUE6wHEpzgYmvH",
    callbackURL: "http://127.0.0.1:8001/api/auth/callback"
  }
}