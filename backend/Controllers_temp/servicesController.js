const Service = require("../models/services");

// =====================================
// GET ALL SERVICES
// PUBLIC
// =====================================

const getAllServices = async (req, res) => {
  try { 
    const services = await Service.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      message: "Services fetched successfully",
      services,
    });
  } catch (error) {
    console.error("Get all services error:", error);

    res.status(500).json({
      message: "Failed to fetch services",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE SERVICE
// PUBLIC
// =====================================

const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    res.status(200).json({
      message: "Service fetched successfully",
      service,
    });
  } catch (error) {
    console.error("Get service by ID error:", error);

    res.status(500).json({
      message: "Failed to fetch service",
      error: error.message,
    });
  }
};

// =====================================
// CREATE SERVICE
// ADMIN ONLY
// =====================================

const createService = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      image,
      category,
      status,
    } = req.body;

    // Required fields
    if (
      !name ||
      !description ||
      price === undefined ||
      !duration
    ) {
      return res.status(400).json({
        message:
          "Name, description, price and duration are required",
      });
    }

    // Check duplicate service
    const existingService = await Service.findOne({
      name: name.trim(),
    });

    if (existingService) {
      return res.status(400).json({
        message: "Service with this name already exists",
      });
    }

    const service = await Service.create({
      name: name.trim(),
      description: description.trim(),
      price,
      duration: duration.trim(),
      image: image || "",
      category: category || "General",
      status: status || "Active",
    });

    res.status(201).json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Create service error:", error);

    res.status(500).json({
      message: "Failed to create service",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE SERVICE
// ADMIN ONLY
// =====================================

const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
      price,
      duration,
      image,
      category,
      status,
    } = req.body;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    // Update only provided fields
    if (name !== undefined) {
      service.name = name.trim();
    }

    if (description !== undefined) {
      service.description = description.trim();
    }

    if (price !== undefined) {
      service.price = price;
    }

    if (duration !== undefined) {
      service.duration = duration.trim();
    }

    if (image !== undefined) {
      service.image = image;
    }

    if (category !== undefined) {
      service.category = category;
    }

    if (status !== undefined) {
      service.status = status;
    }

    await service.save();

    res.status(200).json({
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    console.error("Update service error:", error);

    res.status(500).json({
      message: "Failed to update service",
      error: error.message,
    });
  }
};

// =====================================
// DELETE SERVICE
// ADMIN ONLY
// =====================================

const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({
        message: "Service not found",
      });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({
      message: "Service deleted successfully",
    });
  } catch (error) {
    console.error("Delete service error:", error);

    res.status(500).json({
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};
