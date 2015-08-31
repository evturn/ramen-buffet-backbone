var mongoose = require('mongoose');

exports.User = function() {
  return new mongoose.Schema({
    username   : {type : String, sparse: true},
    password   : {type : String, sparse: true},
    email      : {type : String, sparse: true},
    name       : {type : String, sparse: true},
    lastName   : {type : String, sparse: true},
    firstName  : {type : String, sparse: true},
    gender     : {type : String, sparse: true},
    fbProfile  : {type : String, sparse: true},
    fbId       : {type : String},
    fbToken    : {type : String},
    fbEmail    : {type : String, sparse: true},
    fbName     : {type : String, sparse: true},
    lists      : [ListSchema]
  });
};

exports.Note = function() {
  return new mongoose.Schema({
    list       : {type : String},
    created    : {type : Date,    default: new Date()},
    body       : {type : String},
    done       : {type : Boolean, default: false},
    timestamp  : {type : String},
    updated    : {type : String}
  });
};

exports.List = function() {
  return new mongoose.Schema({
    name       : {type : String},
    icon       : {type : String,  default: 'fa fa-tasks'},
    created    : {type : Date,    default: new Date()},
    notes      : [NoteSchema],
  });
};


var NoteSchema = this.Note();
var ListSchema = this.List();