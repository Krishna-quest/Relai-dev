const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateAddPhase(req) {
  let errors = {};
console.log("req.instruction",req.instruction);
console.log("req.instruction.length",req.instruction.length)
console.log("type of ",typeof(req.instruction))
  req.instruction = !isEmpty(req.instruction) ? req.instruction : '';
  if (typeof(req.instruction==string)){
    errors.instruction = 'require 2 pahse';
  }
 


  return {
    errors,
    isValid: isEmpty(errors)
  };
};