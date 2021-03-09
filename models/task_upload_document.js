const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TaskUploadDocsSchema = new Schema({
  //should be auto generated   
  tuds_docs_id: {
    type: String,
  },
  tuds_phase_name: {
    type: String,
  },
  tuds_task_name: {
    type: String,
  },
  tuds_task_id: {
    type: Schema.Types.ObjectId,
    ref: 'property_professional_task'
  },
  tuds_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "service_provider"
  },

  tuds_customer_id: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  },
  tuds_property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties"
  },
  tuds_document_name: {
    type: String,
  },
  tuds_document_file: {
    data: Buffer,
    contantType: String
  },
  tuds_document_size: {
    type: String,
  },

  tuds_document_type: {
    type: String,
    enum: ['image', 'video', 'pdf', 'doc', 'txt']
  },
  tuds_verification_status: {
    type: String,
    enum: ['pending', 'accept', 'reject'],
    default: 'pending'
  },
  tuds_created_at: {
    type: Date,
    default: Date.now
  },
  tuds_updated_at: {
    type: Date,
  },
  tuds_deleted_at: {
    type: Date
  },
  tuds_is_active_user_flag: {
    type: String,
    enum: ['buyer', 'seller', 'renovator'],
  },

});

module.exports = task_upload_docs = mongoose.model('task_upload_docs', TaskUploadDocsSchema);

