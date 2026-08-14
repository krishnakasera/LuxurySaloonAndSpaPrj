const Appointment = require("../models/Appointment");

// =====================================
// CREATE APPOINTMENT
// =====================================

const createAppointment = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      service,
      date,
      time,
    } = req.body;

    const appointment = await Appointment.create({
      name,
      email,
      phone,
      address,
      service,
      date,
      time,
      status: "Pending",
    });

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment,
    });
  } catch (error) {
    console.error("Create appointment error:", error);

    res.status(500).json({
      message: "Failed to book appointment",
      error: error.message,
    });
  }
};

// =====================================
// GET MY APPOINTMENTS
// =====================================

const getMyAppointments = async (req, res) => {
  try {
    const { email } = req.query;

    console.log("Requested email:", email);

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const appointments = await Appointment.find({
      email: email,
    }).sort({
      createdAt: -1,
    });

    console.log("Appointments:", appointments);

    res.status(200).json(appointments);
  } catch (error) {
    console.error("Get appointments error:", error);

    res.status(500).json({
      message: "Failed to get appointments",
      error: error.message,
    });
  }
};

// =====================================
// CANCEL APPOINTMENT - CUSTOMER
// =====================================

const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("Cancelling appointment:", id);

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    if (appointment.status === "Cancelled") {
      return res.status(400).json({
        message: "Appointment is already cancelled",
      });
    }

    appointment.status = "Cancelled";

    await appointment.save();

    res.status(200).json({
      message: "Appointment cancelled successfully",
      appointment,
    });
  } catch (error) {
    console.error("Cancel appointment error:", error);

    res.status(500).json({
      message: "Failed to cancel appointment",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL APPOINTMENTS - ADMIN
// =====================================

const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    console.error("Get all appointments error:", error);

    res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE APPOINTMENT STATUS - ADMIN
// =====================================

const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Cancelled",
    ];

    // Check status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid status. Use Pending, Confirmed or Cancelled.",
      });
    }

    // Find appointment
    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found",
      });
    }

    // Update status
    appointment.status = status;

    await appointment.save();

    res.status(200).json({
      message: "Appointment status updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(
      "Update appointment status error:",
      error
    );

    res.status(500).json({
      message: "Failed to update appointment status",
      error: error.message,
    });
  }
};

// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {
  createAppointment,
  getMyAppointments,
  cancelAppointment,
  getAllAppointments,
  updateAppointmentStatus,
};