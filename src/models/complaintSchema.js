'use strict';

const mongoose = require('mongoose');
const { Schema } = mongoose;

// create the schema
const complaintSchema = new Schema({
  complaint_id: String,
  complaint_type: String,
  complaint_content: String,
  complaint_date: String,
  invoice_number: { type: Number, unique: true },
  complaint_status: { type: String, default: 'pending' },
  customer_username: String,
  customer_email: String,
  customer_position: String,
});

// create new model
const complaintsModel = mongoose.model('complaints', complaintSchema);

module.exports = complaintsModel;
