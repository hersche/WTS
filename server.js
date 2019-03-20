const express = require('express');
const os = require('os');
const fs = require('fs');
const axios = require('axios')
var config = require('./config');
const fileUpload = require('express-fileupload');
const router = express.Router();
const WebTorrent = require('webtorrent-hybrid');
var client = new WebTorrent()
require('http').globalAgent.options.rejectUnauthorized = false;
require('https').globalAgent.options.rejectUnauthorized = false;
const app = express();
const session = require('express-session');

app.use(session({
  secret: config.cookieKey,
  cookie: {}
}));


const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
var sequelize;
if(config.db.dialect!="sqlite"){
  sequelize = new Sequelize(config.db.dbname, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: config.db.dialect /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });
} else {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: config.db.path
  });
}
const Seed = sequelize.define('seed', {
  title: {
    type: Sequelize.STRING,
    allowNull: false
  },
  filePath: {
    type: Sequelize.STRING
  },
  magnetURL: {
    type: Sequelize.STRING
  }
});
sequelize.sync();
var seedsList = [];
refreshSeeds();

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
  //aconfig
).then((response) => {
  console.log("OAUTH-GEEEEET response")
  console.log(response)
  passport.serializeUser(function(user, done) {
  done(null, user);
  });
passport.deserializeUser(function(user, done) {
  done(null, user);
});
if(response.data.data==undefined){
  return cb(false, response.data);
}
  return cb(false, response.data.data);
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
app.use(express.static('public/css'));
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
app.use(bodyParser.json());


var activeSeedList = [];
function refreshSeeds(cb=undefined){
  Seed.findAll().then(seeds => {
    seedsList = seeds
    //var tmpSeeds = []
    seeds.forEach((row) => {
      console.log(row.title);
      if(activeSeedList.includes(row.id)==false){
        activeSeedList.push(row.id);
        client.seed(row.filePath,{announce:config.rootUrl},function(torrent){
          if(row.magnetURL==""){
            Seed.update({ magnetURL: torrent.magnetURI }, {
              where: {
                id: row.id
              }
            }).then(() => {
              console.log("Done");
              sequelize.sync();
              Seed.findAll().then(seeds2 => {
                seedsList = seeds2
              });
              
            });
          }
          //row.magnetURL = torrent.magnetURI
          //tmpSeeds.push(row)
          console.log("do SEED "+torrent.magnetURI)
        })
      } //else {
        //row.magnetURL = getRowById(row.id).magnetURL
        //tmpSeeds.push(row)
      //}
      
    });
    if(cb!=undefined){
      cb(seedsList)
    }
  //console.log("All users:", JSON.stringify(users, null, 4));
  });
}

function getRowById(id){
  var rVal = undefined
  seedsList.forEach((row) => {
    if(row.id==id){
      rVal = row
    }
  });
  return rVal
}

function rmSeed(id){
  var tmpSeeds = []
  seedsList.forEach((row) => {
    if(row.id!=id){
      tmpSeeds.push(row)
    }
  });
  seedsList = tmpSeeds
  return tmpSeeds
}
router.route('/seedList').get((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(seedsList));
});
router.route('/user').get((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(req.user));
});

router.route('/delete/:id').get((req, res, next) => {
    var theRow = getRowById(Number(req.params.id))
    fs.unlink(theRow.filePath, (err) => {
      if (err) throw err;
      console.log(theRow.filePath+' was deleted');
    });
  
    Seed.destroy({
      where: {
        id: req.params.id
      }
    }).then(() => {
      sequelize.sync();
      console.log("Done");
      rmSeed(Number(req.params.id))
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(seedsList)); 
      console.log(`Delete a row ${this.lastID}`);
    });
  });



//router.route('/upload').get((req, res, next) => {
  //  res.render('upload', { myVar1: 'my variable one' }, { plain: true, inlineCSS: false });
//});
router.route('/upload').post((req, res, next) => {
  req.files.theFile.mv("uploads/"+req.files.theFile.name)
  console.log(req.files.theFile); // the uploaded file object
  
  Seed.create({ title: req.body.title, filePath: "uploads/"+req.files.theFile.name,magnetURL:"" }).then(jane => {
    console.log("Jane's auto-generated ID:", jane.id);
    sequelize.sync();
    refreshSeeds(function(sl){
      res.setHeader('Content-Type', 'application/json');
      res.end("{'msg':'Upload success'}"); 
    })
  });
 });

app.use('/', router);
app.listen(config.serverPort, () => {

  console.log('Server started!');
});