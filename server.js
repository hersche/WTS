const express = require('express');
const os = require('os');
const fs = require('fs');
var seedsList = [];
const axios = require('axios')
var config = require('./config');
const fileUpload = require('express-fileupload');
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
    dialect: config.db.dialect
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
  ,
  userid: {
    type: Sequelize.INTEGER
  }
});
sequelize.sync();

refreshSeeds();

const passport = require('passport'), OAuth2Strategy = require('passport-oauth2')
app.use(passport.initialize());
app.use(passport.session());
passport.use(new OAuth2Strategy(config.oauth2,
  function(accessToken, refreshToken, profile, cb) {
      if(accessToken!=''){
        axios.defaults.headers.common = {'Authorization': 'Bearer '+accessToken}
        console.log("OAUTH-GEEEEET general")
        axios.get(config.oauth2.rootURL+'api/user').then((response) => {
          console.log("OAUTH-GEEEEET response")
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
    }
  ));
const { ensureLoggedIn } = require('connect-ensure-login');
app.use(express.static('public/css'));
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : './tmp/',
  limits: {
    fileSize: config.uploadLimitSize*1000000 //1mb
},
}));
app.use(bodyParser.json());
var activeSeedList = [];
  app.get('/logout',
    ensureLoggedIn('/api/login'),
    function(req, res) {
      req.logout()
      res.redirect('/?LOGOUT');
    });
  app.get('/auth/callback',
    passport.authenticate('oauth2', { failureRedirect: '/?NOSUCCESS' }),
    function(req, res) {
      res.redirect('/');
    });
  app.get('/login', passport.authenticate('oauth2'));





app.get('/seedList',
  function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(seedsList));
  });

app.get('/user',
  function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(req.user));
  });

app.post('/upload',
  ensureLoggedIn('/api/login'),
  function(req, res) {
    req.files.theFile.mv("uploads/"+req.files.theFile.name)
    Seed.create({ title: req.body.title, filePath: "uploads/"+req.files.theFile.name,magnetURL:"",userid:req.user.id }).then(theRow => {
      sequelize.sync();
      refreshSeeds(function(sl){
        res.setHeader('Content-Type', 'application/json');
        res.end("{'msg':'Upload success'}"); 
      })
    });
  });

  app.get('/delete/:id',
    ensureLoggedIn('/api/login'),
    function(req, res) {
      var theRow = getSeedById(Number(req.params.id))
      if(req.user.id==theRow.userid||req.user.admin){
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
          rmSeed(Number(req.params.id))
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(seedsList)); 
          console.log(`Delete a row ${this.lastID}`);
        });
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(seedsList));
      }
    });


app.listen(config.serverPort, () => {
  console.log('Server started at port '+config.serverPort);
});


function refreshSeeds(cb=undefined){
  Seed.findAll().then(seeds => {
    seedsList = seeds
    seeds.forEach((row) => {
      if(activeSeedList.includes(row.id)==false){
        activeSeedList.push(row.id);
        client.seed(row.filePath,{announce:config.rootUrl},function(torrent){
          if(row.magnetURL==""){
            Seed.update({ magnetURL: torrent.magnetURI }, {
              where: {
                id: row.id
              }
            }).then(() => {
              sequelize.sync();
              Seed.findAll().then(seeds2 => {
                seedsList = seeds2
              });
              
            });
          }
          console.log("Start seeding url "+torrent.magnetURI)
        })
      }
      
    });
    if(cb!=undefined){
      cb(seedsList)
    }
  });
}

function getSeedById(id){
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
