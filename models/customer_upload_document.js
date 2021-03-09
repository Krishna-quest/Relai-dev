const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CustomerUploadDocsSchema = new Schema({
  //should be auto generated   
  cuds_docs_id: {
    type: String,
  },
  cuds_customer_id: {
    type: Schema.Types.ObjectId,
    ref: "customers"
  },
  cuds_property_id: {
    type: Schema.Types.ObjectId,
    ref: "properties"
  },
  cuds_document_name: {
    type: String,
  },
  cuds_document_file: {
    data: Buffer,
    contantType: String
  },
  cuds_document_size: {
    type: String,
  },

  cuds_document_type: {
    type: String,
    enum: ['image', 'video', 'pdf', 'doc', 'txt']
  },
  cuds_verification_status: {
    type: String,
    enum: ['pending', 'accept', 'reject'],
    default: 'pending'
  },
  cuds_created_at: {
    type: Date,
    default: Date.now
  },
  cuds_updated_at: {
    type: Date,
  },
  cuds_deleted_at: {
    type: Date
  },
  cuds_is_active_user_flag: {
    type: String,
    enum: ['buyer', 'seller', 'renovator'],
  },
  //==============================task fild==================
  cuds_phase_name: {
    type: String,
    },
    cuds_task_name: {
    type: String,
    },
    cuds_task_id: {
    type: Schema.Types.ObjectId,
    ref: 'property_professional_task'
    },
    cuds_service_provider_id: {
    type: Schema.Types.ObjectId,
    ref: "service_provider"
    },
    cuds_phase_flag: {
    type: String,
    }
});

module.exports = customersuploaddocs = mongoose.model('customersuploaddocs', CustomerUploadDocsSchema);

