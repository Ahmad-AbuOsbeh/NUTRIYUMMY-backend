'use strict';

const express = require('express');

// import Interface to contact with DB
const Interface = require('../models/Interface');

// import user model
const complaintsModel = require('../models/complaintSchema');

// create new instance of Interface class
const interfaceDB = new Interface(complaintsModel);

// access control list middleware
const permissions = require('../middlewares/acl');

// bearer auth middleware
const bearerAuth = require('../middlewares/bearerAuth');

// use express Router
const router = express.Router();

// admin routes
router.get('/allComplaints', bearerAuth, permissions('read-all'), getAllComplaintsHandler);
router.put('/complaint/:id', bearerAuth, permissions('update'), updateComplaintHandler);

// customer routes
router.get('/myComplaints', bearerAuth, permissions('read-limitted'), getMyComplaintsHandler);
router.post('/complaint', bearerAuth, permissions('create'), createComplaintHandler);
router.delete('/complaint/:id', bearerAuth, permissions('delete-limitted'), deleteComplaintHandler);

// get all complaints handler
async function getAllComplaintsHandler(req, res, next) {
  try {
    let allRecords = await interfaceDB.get();
    res.status(200).send(allRecords);
  } catch (error) {
    next(error.message, 'get all complaints error');
  }
}

// update complaint handler
async function updateComplaintHandler(req, res, next) {
  let { id } = req.params;
  let { status } = req.body;

  try {
    let complaintData = await interfaceDB.get(id);
    complaintData.complaint_status = status;
    await complaintData.save();
    res.status(201).send(complaintData);
  } catch (error) {
    next(error.message, 'update complaint error');
  }
}

// get customer complaint handler
async function getMyComplaintsHandler(req, res, next) {
  const { email } = req.user;

  try {
    let allRecords = await interfaceDB.getByMail(email);
    res.status(200).send(allRecords);
  } catch (error) {
    next(error.message, 'get customer complaints error');
  }
}

// create complaint handler
async function createComplaintHandler(req, res, next) {
  const { username, email, city } = req.user;
  const { complaintType, complaintContent, complaintDate, invoiceNumber } = req.body;

  // generate unique id for the complaint
  const complaintID = `${username.slice(0, 3)}-${Math.floor(Math.random() * (100000 - 10000)) + 10000}`;

  const obj = {
    complaint_id: complaintID,
    complaint_type: complaintType,
    complaint_content: complaintContent,
    complaint_date: complaintDate,
    invoice_number: invoiceNumber,
    customer_username: username,
    customer_email: email,
    customer_position: city,
  };
  try {
    const addedComplaint = await interfaceDB.create(obj);
    res.status(200).send(addedComplaint);
  } catch (error) {
    next(error.message, ' add complaint error');
  }
}

// delete complaint handler
async function deleteComplaintHandler(req, res, next) {
  const { id } = req.params;
  try {
    const deletedComplaint = await interfaceDB.delete(id);
    res.status(200).send(deletedComplaint);
  } catch (error) {
    next(error.message, 'delete complaint error');
  }
}

module.exports = router;
