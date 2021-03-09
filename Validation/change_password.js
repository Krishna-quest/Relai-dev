const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateChangePasswordInput(req) {
  let errors = {};

  req.cus_password = !isEmpty(req.cus_password) ? req.cus_password : '';
  req.confirmPassword = !isEmpty(req.confirmPassword) ? req.confirmPassword : '';

  //Password Validation
  if (Validator.isEmpty(req.cus_password)) {
    errors.cus_password = 'Password field is required';
  }

  if (!Validator.isLength(req.cus_password, { min: 6, max: 30 })) {
    errors.cus_password = 'Password must be at least 6 characters';
  }

  //confirm Password Validations
  if (Validator.isEmpty(req.confirmPassword)) {
    errors.confirmPassword = 'Confirm Password field is required';
  }
  if (!Validator.equals(req.cus_password, req.confirmPassword)) {
    errors.confirmPassword = 'Passwords must match!';
  }


  return {
    errors,
    isValid: isEmpty(errors)
  };
};
