const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ComplaintsSchema = new Schema({
  //should be auto generated from mongo
  coms_id: {
    type: String
  },
  coms_complaint_for: {
    type: Schema.Types.ObjectId,
    ref: "service_providers"
  },
  coms_complaint_code: {
    type: String,
  },
  coms_property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties"
  },
  coms_user_id: {
    type: Schema.Types.ObjectId,
    //ref: "customers"    //Need to check if complain raised by service_provider then store sp_id
  },
  coms_user_name: {
    type: String,
  },
  coms_user_profile_img: {
    type: String
  },
  coms_complaint_by: {
    type: String,
    enum: ['customer', 'service_provider']
  },
  coms_complaint_subject: {
    type: String,
  },
  coms_complaint_note: {
    type: String,
  },
  coms_complaint_help: {
    type: String,
  },
  coms_complaint_file: {
    data: Buffer,
    contantType: String 
  },
  coms_complaint_filename: {
    type: String
  },
  coms_complaint_filetype: {
    type: String
  },
  coms_complaint_status: {
    type: String,
    enum: ['pending', 'completed'],
    default: 'pending'
  },
  coms_created_at: {
    type: Date,
    default: Date.now
  },
  coms_updated_at: {
    type: Date,
  },
  coms_deleted_at: {
    type: Date,
  },
  coms_is_active_user_flag: {
    type: String,
    enum: ['buyer', 'seller', 'renovator'],
  },
});
module.exports = complaints = mongoose.model('complaints', ComplaintsSchema);
