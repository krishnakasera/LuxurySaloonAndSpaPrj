const express = require("express");

const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require("../controllers/servicesController");

const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =====================================
// GET ALL SERVICES
// PUBLIC
// =====================================

router.get("/", getAllServices);

// =====================================
// GET SINGLE SERVICE
// PUBLIC
// =====================================

router.get("/:id", getServiceById);

// =====================================
// CREATE SERVICE
// ADMIN ONLY
// =====================================

router.post(
  "/",
  adminMiddleware,
  createService
);

// =====================================
// UPDATE SERVICE
// ADMIN ONLY
// =====================================

router.put(
  "/:id",
  adminMiddleware,
  updateService
);

// =====================================
// DELETE SERVICE
// ADMIN ONLY
// =====================================

router.delete(
  "/:id",
  adminMiddleware,
  deleteService
);

module.exports = router;