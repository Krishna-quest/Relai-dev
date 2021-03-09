const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateProfChangePasswordInput(req) {
  let errors = {};

  req.sps_password = !isEmpty(req.sps_password) ? req.sps_password : '';
  req.confirmPassword = !isEmpty(req.confirmPassword) ? req.confirmPassword : '';

  //Password Validation
  if (Validator.isEmpty(req.sps_password)) {
    errors.sps_password = 'Password field is required';
  }

  if (!Validator.isLength(req.sps_password, { min: 6, max: 30 })) {
    errors.sps_password = 'Password must be at least 6 characters';
  }

  //confirm Password Validations
  if (Validator.isEmpty(req.confirmPassword)) {
    errors.confirmPassword = 'Confirm Password field is required';
  }
  if (!Validator.equals(req.sps_password, req.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match!';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
