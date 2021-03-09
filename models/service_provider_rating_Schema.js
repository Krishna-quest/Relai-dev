const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const RatingSchema = new Schema({
  //should be auto generated from mongo
  sprs_rating_id: {
    type: String,
  },
  sprs_service_provider_id: {
    type: Schema.Types.ObjectId
  },
  sprs_submitted_by: {
    type: Schema.Types.ObjectId
  },
  sprs_submitted_by_name: {
    type: String
  },
  sprs_rating: {
    type: String,
  },
  sprs_review: {
    type: String,
  },
  sprs_submitted_profile_img: {
    type: String
  },
  sprs_created_at: {
    type: Date,
    default: Date.now
  },
  sprs_updated_at: {
    type: Date,
  },
  sprs_deleted_at: {
    type: Date
  },
  sprs_is_active_user_flag: {
    type: String,
    enum: ['buyer', 'seller', 'renovator'],
  },

});
module.exports = message = mongoose.model('sp_review_rating', RatingSchema);
