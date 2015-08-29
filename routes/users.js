var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var fbConfig = require('../config/passport-facebook');
var localConfig = require('passport-local');
var bodyParser = require('body-parser');
var urlencoded = bodyParser.urlencoded({extended: false});
var User = require('../models/User');
var bcrypt = require('bcrypt');


var users = express.Router();

users.get('/', ensureAuthenticated, function(req, res, next) {
  res.json(req.user);
});

users.post('/usernames', ensureAuthenticated, urlencoded, function(req, res, next) {
  User.findByUsername(req.body.username, function(err, user) {
    if (err) {
      console.log(err);
    }
    else if (user === null) {
      res.json({message: 'Available'});
    }
    else if (user) {
      res.json({message: 'Taken'});
    }
  });
});

users.put('/:id', ensureAuthenticated, urlencoded, function(req, res, next) {
  var user = req.user;
  var data = req.body;

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return next(err);
    }
    bcrypt.hash(data.password, salt, function(err, hash) {
      if (err) {
        return next(err);
      }
      user.username = data.username;
      user.password = hash;
      user.save(function(err, data) {
        if (err) {
          console.log(err)
          return err;
        }
        res.send(data);
      });
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.render('landing/index', {layout: 'landing'});
}

module.exports = users;