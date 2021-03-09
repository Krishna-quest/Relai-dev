const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ServiceProviderSchema = new Schema({

  //should be objectID genrated by MongoDB
  sps_id: {
    type: Number,
  },
  sps_unique_code: {
    type: String,
    required: true,
  },
  sps_user_role_id: {
    type: Number,
  },
  sps_user_type: {
    type: String,
    enum: ['DEFAULT', 'solicitor'],
    default: 'DEFAULT',
  },
  sps_firstname: {
    type: String,
    required: true,
  },
  sps_lastname: {
    type: String,
    required: true,
  },
  sps_fullname: {
    type: String,
    required: true,
  },
  sps_state: {
    type: String,
    required: true,
  },
  sps_email_id: {
    type: String,
    required: true,
  },
  sps_phone_number: {
    type: String,
    required: true,
  },
  sps_address: {
    type: String,
  },
  sps_country_id: {
    type: String,
    required: true,
  },
  sps_city: {
    type: String,
    required: true,
  },
  sps_password: {
    type: String,
    required: true,
  },
  sps_role_name: {
    type: String
  },
  sps_experience: {
    type: String
  },
  sps_kyc_status: {
    type: String,
    enum: ['DEFAULT', 'TRUE'],
    default: 'DEFAULT',
  },
  sps_deleted: {
    type: String,
    enum: ['DEFAULT', 'TRUE'],
    default: 'DEFAULT',
  },
  sps_created_at: {
    type: Date,
    default: Date.now,
  },
  sps_updated_at: {
    type: Date,

  },
  sps_deleted_at: {
    type: Date,

  },
  sps_status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',

  },
  sps_email_verification_status: {
    type: String,
    enum: ['yes', 'no'],
    default: 'no'
  },
  sps_otp: {
    type: String,

  },
  sps_otp_expire_time: {
    type: String,
  },
});


module.exports = ServiceProvider = mongoose.model('serviceProviders', ServiceProviderSchema);

