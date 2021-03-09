const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ComplaintsDetailSchema = new Schema({
  //should be auto generated from mongo
  comsd_id: {
    type: String
  },
  comsd_user_id: {
    type: Schema.Types.ObjectId,
    //ref: "customers"    //Need to check if complain raised by service_provider then store sp_id
  },
  comsd_user_name: {
    type: String,
  },
  comsd_user_profile_img: {
    type: String
  },
  comsd_complaint_note: {
    type: String,
  },
  comsd_complaint_file: {
    data: Buffer,
    contantType: String 
  },
  comsd_complaint_filename: {
    type: String
  },
  comsd_complaint_filetype: {
    type: String
  },
  comsd_created_at: {
    type: Date,
    default: Date.now
  },
});
module.exports = complaints = mongoose.model('complaints_details', ComplaintsDetailSchema);
