'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create the schema
const complaintSchema = new Schema({
  complaint_id: { type: String, required: true },
  complaint_type: { type: String, required: true },
  complaint_content: String,
  complaint_date: { type: String, required: true },
  invoice_number: { type: Number, required: true, unique: true },
  complaint_status: { type: String, required: true, default: 'Pending' },
  customer_username: { type: String, required: true },
  customer_email: { type: String, required: true },
  customer_position: String,
});

// create new model
const complaintsModel = mongoose.model('complaints', complaintSchema);

module.exports = complaintsModel;
