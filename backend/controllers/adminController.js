const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================================
// CREATE ADMIN
// =====================================

const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Name, email, password and phone are required",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      phone,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin created successfully",

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Create admin error:", error);

    res.status(500).json({
      message: "Failed to create admin",
      error: error.message,
    });
  }
};

// =====================================
// ADMIN LOGIN
// =====================================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin account required.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Admin login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// =====================================
// MAKE EXISTING USER ADMIN
// =====================================

const makeAdmin = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.role = "admin";

    await user.save();

    res.status(200).json({
      message: "User is now an admin",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Make admin error:", error);

    res.status(500).json({
      message: "Failed to make admin",
      error: error.message,
    });
  }
};

// =====================================
// RESET ADMIN PASSWORD
// =====================================

const resetAdminPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        message: "This user is not an admin",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    await user.save();

    res.status(200).json({
      message: "Admin password reset successfully",
    });
  } catch (error) {
    console.error(
      "Reset admin password error:",
      error
    );

    res.status(500).json({
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL CUSTOMERS
// =====================================

const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({
      role: "customer",
    })
      .select("-password")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      message: "Customers fetched successfully",
      customers,
    });
  } catch (error) {
    console.error(
      "Get customers error:",
      error
    );

    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {
  createAdmin,
  adminLogin,
  makeAdmin,
  resetAdminPassword,
  getAllCustomers,
};