var mongoose = require('mongoose');
const session = require('express-session');
var { Customers, update } = require('../models/customers');


var isAdmin = function (req, res, next) {

  var check_user = req.session.admin_main_id;
  if (check_user == undefined && check_user == null && check_user == "") {

    res.redirect('/admin-login');
  }
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();

}
//userId 

var isCustomer = function (req, res, next) {
  var check_user = req.session.is_user_logged_in;
  //var check_active_customer_login = req.session.active_user_login;
  //console.log("check_active_customer_login is :", check_active_customer_login);
  if (check_user != undefined && check_user != "" && check_user == true) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');

    next();
  } else {
    req.flash('danger', 'Please log in first.');
    res.redirect('/signin');
  }
}


var isServiceProvider = function (req, res, next) {
  var check_user = req.session.is_user_logged_in;
  // var check_user_id = req.session.re_us_id;
  if (check_user != undefined && check_user != "" && check_user == true) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  } else {
    req.flash('danger', 'Please log in first.');
    res.redirect('/signin-professional');
  }
}




var isDeveloper = function (req, res, next) {
  var check_user_type = req.session.user_type;

  if (check_user_type == '5d306e3776b9b17261b0d544') {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  } else {
    req.flash('danger', 'Please log in first.');
    res.redirect('/not-available');
  }
}





var isContractor = function (req, res, next) {
  var check_user_type = req.session.user_type;
  console.log(check_user_type);

  if (check_user_type == '5d3074807d7a22e731d4a14b') {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
  } else {
    req.flash('danger', 'Please log in first.');
    res.redirect('/not-available');
  }
}


module.exports = {

  isCustomer: isCustomer,
  isAdmin: isAdmin,
  isDeveloper: isDeveloper,
  isContractor: isContractor,
  isServiceProvider: isServiceProvider

}


