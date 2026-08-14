require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const serviceRoutes = require("./routes/servicesRoutes");

const app = express();

// =====================================
// MIDDLEWARE
// =====================================

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json());

// =====================================
// CONNECT DATABASE
// =====================================

connectDB();

// =====================================
// TEST ROUTE
// =====================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Luxury Salon & Spa Backend is running",
  });
});

// =====================================
// AUTH ROUTES
// =====================================

app.use("/api/auth", authRoutes);

// =====================================
// APPOINTMENT ROUTES
// =====================================

app.use("/api/appointments", appointmentRoutes);

// =====================================
// SERVICE ROUTES
// =====================================

app.use("/api/services", serviceRoutes);

// =====================================
// ADMIN ROUTES
// =====================================

app.use("/api/admin", adminRoutes);

// =====================================
// ERROR HANDLER
// =====================================

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// =====================================
// LOCAL SERVER
// =====================================

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// =====================================
// EXPORT FOR VERCEL
// =====================================

module.exports = app;