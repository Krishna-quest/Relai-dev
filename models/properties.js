const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const PropertiesSchema = new Schema({

  //should be objectID genrated by MongoDB
  ps_property_id: {
    type: String,
  },

  ps_unique_code: {
    type: String,
  },
  ps_user_id: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  },
  ps_property_name: {
    type: String,
  },
  ps_property_address: {
    type: String,
  },
  ps_property_country_id: {
    type: Schema.Types.ObjectId,
    ref: "country"
  },
  ps_property_state_id: {
    type: Schema.Types.ObjectId,
    ref: "state"
  },
  ps_property_city_id: {
    type: Schema.Types.ObjectId,
    ref: "city"
  },
  ps_property_zipcode: {
    type: String,
  },
  ps_property_user_as: {
    type: String,
    enum: ['buyer', 'seller', 'renovator']
  },
  ps_other_party_user_as: {
    type: String,
    enum: ['buyer', 'seller', 'renovator']
  },
  ps_other_party_emailid: {
    type: String,
  },
  ps_other_party_invited: {
    type: String,
    enum: ['registered', 'invited'],
    default: 'registered'
  },
  ps_property_area: {
    type: String,
  },
  ps_property_bedroom: {
    type: String,
  },
  ps_property_bathroom: {
    type: String,
  },
  ps_additional_note: {
    type: String,
  },
  ps_property_type: {
    type: String,
    enum: ['new', 'chain'],
    default: 'new'
  },
  //should be mongodb generated objectId
  ps_chain_property_id: {
    type: String,
  },
  ps_created_at: {
    type: Date,
    default: Date.now
  },
  ps_updated_at: {
    type: Date,
  },
  ps_deleted_at: {
    type: Date,
  },
  ps_deleted: {
    type: String,
    enum: ['0', '1'],
    default: '0'
  },
});
module.exports = properties = mongoose.model('properties', PropertiesSchema);