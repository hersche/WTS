const os = require('os');
const fs = require('fs');
const express = require('express');
const WebTorrent = require('webtorrent-hybrid');
var client = new WebTorrent()
const config = require('./config');
var seedsList = []
const router = express.Router();
// const Vue = require('vue')
const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./wts.db');
db.run('CREATE TABLE IF NOT EXISTS seeds (id INTEGER PRIMARY KEY AUTOINCREMENT, title VARCHAR(100),filePath VARCHAR(255), magnetURL TEXT);', [], (err) => {  
  if (err) {
    console.log('ERROR ON CREATE TABLE!', err)
  }
  refreshSeeds();
})


function refreshSeeds(){
  var tmpSeeds = []
  db.all("SELECT * FROM seeds", [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row.name);
    if(getRowById(row.id)==undefined){
      client.seed(row.filePath,{announce:config.rootUrl},function(torrent){
        row.magnetURL = torrent.magnetURI
        tmpSeeds.push(row)
        console.log("do SEED "+torrent.magnetURI)
      })
    } else {
      row.magnetURL = getRowById(row.id).magnetURL
      tmpSeeds.push(row)
    }
    
  });
  seedsList = tmpSeeds
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

router.route('/').get((req, res, next) => {
  res.render('main', { seeds: seedsList }, { plain: true, inlineCSS: false });
});

router.route('/delete/:id').get((req, res, next) => {
  var theRow = getRowById(Number(req.params.id))
  fs.unlink(theRow.filePath, (err) => {
    if (err) throw err;
    console.log(theRow.filePath+' was deleted');
  });
  db.run(`DELETE FROM seeds WHERE id=?`, [Number(req.params.id)], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    rmSeed(Number(req.params.id))
    console.log(`Delete a row ${this.lastID}`);
  });
  res.render('delete', { seeds: seedsList }, { plain: true, inlineCSS: false });  
});

router.route('/upload').get((req, res, next) => {
    let data = function() {
        tree: []
    };
    res.render('upload', { myVar1: 'my variable one' }, { plain: true, inlineCSS: false });
});
router.route('/upload').post((req, res, next) => {
  req.files.theFile.mv("uploads/"+req.files.theFile.name)
  console.log(req.files.theFile); // the uploaded file object
  db.run(`INSERT INTO seeds(title,filePath,magnetURL) VALUES(?,?,?)`, [req.body.title,"uploads/"+req.files.theFile.name,""], function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  let data = function() {
      tree: []
  };
  refreshSeeds()
  res.render('uploaded', { seeds: seedsList }, { plain: true, inlineCSS: false });
});
module.exports = router; 
