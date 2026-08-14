const express = require("express");

const {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();

// =====================================
// CREATE APPOINTMENT
// =====================================

router.post("/", createAppointment);

// =====================================
// GET MY APPOINTMENTS
// =====================================

router.get("/my", getMyAppointments);

// =====================================
// CANCEL APPOINTMENT
// =====================================

router.put("/:id/cancel", cancelAppointment);

module.exports = router;