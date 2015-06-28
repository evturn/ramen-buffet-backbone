var express = require('express');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook');
var fbConfig = require('../config/passport-facebook');
var app = express.Router();

app.get('/', ensureAuthenticated, function(req, res) {
  res.render('app/index', {layout: 'app', user: req.user});
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
    // function will not be called.
  });

app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/');
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  res.render('landing/index', {layout: 'landing'});
};

module.exports = app;