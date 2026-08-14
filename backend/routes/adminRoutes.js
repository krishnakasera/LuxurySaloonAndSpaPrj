const express = require("express");

const {
  createAdmin,
  adminLogin,
  makeAdmin,
  getAllCustomers,
} = require("../controllers/adminController");

const {
  getAllAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// ADMIN LOGIN
// PUBLIC ROUTE
// =====================================

router.post(
  "/login",
  adminLogin
);

// =====================================
// CREATE ADMIN
// PROTECTED - ADMIN ONLY
// =====================================

router.post(
  "/create",
  adminMiddleware,
  createAdmin
);

// =====================================
// MAKE EXISTING USER ADMIN
// PROTECTED - ADMIN ONLY
// =====================================

router.put(
  "/make-admin",
  adminMiddleware,
  makeAdmin
);

// =====================================
// ADMIN DASHBOARD
// PROTECTED - ADMIN ONLY
// =====================================

router.get(
  "/dashboard",
  adminMiddleware,
  (req, res) => {
    res.status(200).json({
      message: "Welcome to Admin Dashboard",
      admin: req.admin,
    });
  }
);

// =====================================
// GET ALL APPOINTMENTS
// PROTECTED - ADMIN ONLY
// =====================================

router.get(
  "/appointments",
  adminMiddleware,
  getAllAppointments
);

// =====================================
// UPDATE APPOINTMENT STATUS
// PROTECTED - ADMIN ONLY
// =====================================

router.put(
  "/appointments/:id/status",
  adminMiddleware,
  updateAppointmentStatus
);

// =====================================
// GET ALL CUSTOMERS
// PROTECTED - ADMIN ONLY
// =====================================

router.get(
  "/customers",
  adminMiddleware,
  getAllCustomers
);

module.exports = router;